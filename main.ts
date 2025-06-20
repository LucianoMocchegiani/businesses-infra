import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { SqlDatabaseInstance } from "@cdktf/provider-google/lib/sql-database-instance";
import { SqlDatabase } from "@cdktf/provider-google/lib/sql-database";
import { SqlUser } from "@cdktf/provider-google/lib/sql-user";
import { CloudRunService } from "@cdktf/provider-google/lib/cloud-run-service";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: "TU_ID_DE_PROYECTO",
      region: "us-central1",
    });

    // Cloud SQL Instance (PostgreSQL)
    const dbInstance = new SqlDatabaseInstance(this, "db-instance", {
      name: "businesses-db",
      databaseVersion: "POSTGRES_15",
      region: "us-central1",
      settings: {
        tier: "db-f1-micro",
        ipConfiguration: {
          // Solo para pruebas, en producción usa redes privadas y/o Cloud SQL Proxy
          authorizedNetworks: [{ value: "0.0.0.0/0" }]
        }
      }
    });

    // Database
    new SqlDatabase(this, "db", {
      name: "businesses",
      instance: dbInstance.name,
    });

    // DB User
    new SqlUser(this, "db-user", {
      name: "postgres",
      instance: dbInstance.name,
      password: "postgres", // Usa Secret Manager en producción
    });

    // Cloud Run Service
    new CloudRunService(this, "cloudrun", {
      name: "businesses-server",
      location: "us-central1",
      template: {
        spec: {
          containers: [
            {
              image: "gcr.io/TU_ID_DE_PROYECTO/businesses-server",
              env: [
                {
                  name: "DATABASE_URL",
                  value: "postgresql://postgres:postgres@/businesses?host=/cloudsql/" + dbInstance.connectionName
                },
                {
                  name: "FIREBASE_SERVICE_ACCOUNT",
                  value: "TU_FIREBASE_JSON"
                }
              ]
            }
          ]
        }
      },
      traffic: [{ percent: 100, latestRevision: true }]
    });
  }
}

const app = new App();
new MyStack(app, "businesses-infra");
app.synth();