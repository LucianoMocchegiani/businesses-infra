import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { SqlDatabaseInstance } from "@cdktf/provider-google/lib/sql-database-instance";
import { SqlDatabase } from "@cdktf/provider-google/lib/sql-database";
import { SqlUser } from "@cdktf/provider-google/lib/sql-user";
import { CloudRunService } from "@cdktf/provider-google/lib/cloud-run-service";
import { CloudRunServiceIamMember } from "@cdktf/provider-google/lib/cloud-run-service-iam-member";
import * as dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();
const { GC_PROJECT_ID, GC_REGION, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: GC_PROJECT_ID,
      region: GC_REGION,
    });

    // Cloud SQL Instance (PostgreSQL)
    const dbInstance = new SqlDatabaseInstance(this, "db-instance", {
      name: "businesses-db",
      databaseVersion: "POSTGRES_15",
      region: GC_REGION,
      settings: {
        tier: "db-f1-micro",
        ipConfiguration: {
          // Solo para pruebas, en producción usar redes privadas y/o Cloud SQL Proxy
          authorizedNetworks: [{ value: "0.0.0.0/0" }]
        }
      }
    });

    // Database
    new SqlDatabase(this, "db", {
      name: DB_NAME || "businesses",
      instance: dbInstance.name,
    });

    // DB User
    new SqlUser(this, "db-user", {
      name: DB_USER || "postgres",
      instance: dbInstance.name,
      password: DB_PASSWORD,
    });

    // Cloud Run Service
    const cloudRun =new CloudRunService(this, "cloudrun", {
      name: "businesses-server",
      location: GC_REGION || "us-central1",
      template: {
        spec: {
          containers: [
            {
              image: `gcr.io/${GC_PROJECT_ID}/businesses-server`,
              env: [
                {
                  name: "DATABASE_URL",
                  value: process.env.DATABASE_URL || "postgresql://postgres:postgres@34.58.144.189:5432/businesses"
                },
                {
                  name: "FIREBASE_SERVICE_ACCOUNT",
                  value: process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
                }
              ]
            }
          ]
        }
      },
      traffic: [{ percent: 100, latestRevision: true }],

      // Esto es solo para pruebas, en producción se debe usar autenticación
      autogenerateRevisionName: true,
      dependsOn: [],
    });

    // Permitir tráfico no autenticado usando IAM 
    // Esto es solo para pruebas, en producción se debe usar autenticación
    new CloudRunServiceIamMember(this, "cloudrun-iam", {
      service: "businesses-server",
      location: GC_REGION || "us-central1",
      role: "roles/run.invoker",
      member: "allUsers",
      dependsOn: [cloudRun],
    });
  }
}

const app = new App();
new MyStack(app, "businesses-infra");
app.synth();