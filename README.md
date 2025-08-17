# Businesses Infrastructure

Esta es la infraestructura como código (IaC) para el proyecto Businesses Admin, construida con **CDKTF (Cloud Development Kit for Terraform)** y **TypeScript**.

## 🏗️ Arquitectura

La infraestructura despliega los siguientes recursos en Google Cloud Platform:

- **Cloud SQL (PostgreSQL)**: Base de datos principal del sistema
- **Cloud Run**: Servicio de contenedores para el backend API
- **IAM**: Configuración de permisos y accesos

## 📋 Requisitos Previos

Antes de desplegar la infraestructura, asegúrate de tener:

1. **Node.js** (versión 18 o superior)
2. **npm** o **yarn**
3. **Terraform** instalado
4. **Google Cloud CLI** configurado
5. **Credenciales de servicio** de Google Cloud

### Configuración de Google Cloud

```bash
# Instalar Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Autenticarse
gcloud auth login
gcloud auth application-default login

# Configurar proyecto
gcloud config set project businesses-dev-41943
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Google Cloud Configuration
GC_PROJECT_ID=businesses-dev-41943
GC_REGION=us-central1

# Database Configuration
DB_NAME=businesses
DB_USER=postgres
DB_PASSWORD=tu_password_seguro

# Firebase Service Account (JSON string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Database URL for application
DATABASE_URL=postgresql://postgres:password@IP:5432/businesses
```



## 📦 Comandos Disponibles

### Desarrollo

```bash
# Build completo
npm run build
```

### Terraform/CDKTF

```bash

# Desplegar infraestructura
cdktf deploy

# Destruir infraestructura
cdktf destroy
```

## 🎯 Despliegue

- **[📖 Despliegue](./docs/deploy.md)** - 

## 🗄️ Estructura del Proyecto

```
businesses-infra/
├── main.ts              # Configuración principal de la infraestructura
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
├── cdktf.json          # Configuración de CDKTF
├── .env                # Variables de entorno (no versionado)
├── .gitignore          # Archivos ignorados por git
├── docs/               # Documentación
│   └── deploy.md       # Guía detallada de despliegue
└── __tests__/          # Tests unitarios
    └── main-test.ts
```

## 🔧 Recursos Desplegados

### Cloud SQL Instance
- **Nombre**: `businesses-db`
- **Versión**: PostgreSQL 15
- **Tier**: `db-f1-micro` (desarrollo)
- **Región**: `us-central1`

### Cloud Run Service
- **Nombre**: `businesses-server`
- **Región**: `us-central1`
- **Imagen**: `gcr.io/businesses-dev-41943/businesses-server`
- **Variables de entorno**: DATABASE_URL, FIREBASE_SERVICE_ACCOUNT

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Error de autenticación**:
   ```bash
   gcloud auth application-default login
   ```

2. **Variables de entorno faltantes**:
   - Verificar que el archivo `.env` esté configurado correctamente

3. **Error de compilación**:
   ```bash
   npm run get  # Actualizar providers
   npm run compile
   ```

4. **Estado de Terraform corrompido**:
   - Revisar archivos `terraform.*.tfstate`
   - Hacer backup antes de cambios importantes

## 📚 Enlaces Útiles

- [CDKTF Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [Google Cloud Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

## 🔒 Seguridad

⚠️ **IMPORTANTE**:
- Nunca commitear el archivo `.env` o credenciales
- Usar variables de entorno para información sensible
- Mantener actualizadas las credenciales de servicio
- Revisar permisos de IAM regularmente

## 🤝 Contribución

1. Crear una branch para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit de los cambios: `git commit -m "feat: descripción"`
3. Push a la branch: `git push origin feature/nueva-funcionalidad`
4. Crear un Pull Request

## 📄 Licencia

Este proyecto es privado.