# 🚀 Guía de Despliegue - Businesses Infrastructure

## Proceso Simple de Despliegue

### 1. Desde `businesses-server/` terminal:

```bash
# Construir y pushear imagen Docker
docker build -t gcr.io/businesses-dev-41943/businesses-server .
docker push gcr.io/businesses-dev-41943/businesses-server
```

### 2. Desde `businesses-infra/` terminal:

```bash
# Instalar dependencias
npm install

# Desplegar infraestructura
npx cdktf deploy
```

## ⚠️ Requisitos Previos

- Docker instalado y autenticado con GCR
- Google Cloud CLI configurado: `gcloud auth configure-docker`
- Variables de entorno configuradas en `.env`

## 🔧 Configuración de Docker para GCR

Si es la primera vez, configurar Docker para Google Container Registry:

```bash
gcloud auth configure-docker
```

## 📝 Notas

- Asegúrate de estar en el directorio correcto para cada comando
- El deploy de CDKTF puede tomar 5-10 minutos
- Confirma con `yes` cuando CDKTF te lo solicite