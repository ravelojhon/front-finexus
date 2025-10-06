# 🚀 Guía de Deploy - FinExus Frontend

Esta guía te ayudará a desplegar la aplicación Angular en Vercel o Netlify.

## 📋 Prerequisitos

- Cuenta en [Vercel](https://vercel.com) o [Netlify](https://netlify.com)
- Repositorio conectado a GitHub
- Node.js 18+ instalado localmente

## 🔧 Configuración del Proyecto

### 1. Variables de Entorno

Antes del deploy, actualiza la URL de la API en `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-backend.com/api', // Tu URL real de API
  apiTimeout: 15000,
  enableLogging: false,
  enableMockData: false
};
```

### 2. Build de Producción

```bash
# Generar build optimizado
ng build --configuration production

# El build se genera en: dist/gestion-productos/
```

## 🌐 Deploy en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar Repositorio**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Angular

2. **Configuración**:
   - **Framework Preset**: Angular
   - **Build Command**: `ng build --configuration production`
   - **Output Directory**: `dist/gestion-productos`
   - **Install Command**: `npm install`

3. **Variables de Entorno** (si es necesario):
   - `NODE_VERSION`: `18`
   - `API_URL`: Tu URL de API backend

### Opción 2: Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel --prod

# O usar el script del package.json
npm run deploy:vercel
```

### Configuración de Vercel

El archivo `vercel.json` ya está configurado con:
- ✅ Rutas SPA (Single Page Application)
- ✅ Headers de cache para assets
- ✅ Redirects para Angular Router

## 🌐 Deploy en Netlify

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar Repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Netlify detectará la configuración automáticamente

2. **Configuración**:
   - **Build Command**: `ng build --configuration production`
   - **Publish Directory**: `dist/gestion-productos`
   - **Node Version**: `18`

### Opción 2: Deploy Manual

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login en Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist/gestion-productos

# O usar el script del package.json
npm run deploy:netlify
```

### Configuración de Netlify

El archivo `netlify.toml` ya está configurado con:
- ✅ Redirects para SPA
- ✅ Headers de cache optimizados
- ✅ Configuración de build

## 🔧 Scripts de Deploy

### Scripts Disponibles

```bash
# Build de producción
npm run build:prod

# Deploy a Vercel
npm run deploy:vercel

# Deploy a Netlify
npm run deploy:netlify

# Tests antes del deploy
npm run test:ci
```

## 📊 Optimizaciones de Producción

### Bundle Analysis

```bash
# Analizar el bundle
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/gestion-productos/stats.json
```

### Optimizaciones Aplicadas

- ✅ **Tree Shaking**: Eliminación de código no utilizado
- ✅ **Minificación**: Código y CSS minificados
- ✅ **Compresión Gzip**: Assets comprimidos
- ✅ **Lazy Loading**: Carga diferida de módulos
- ✅ **AOT Compilation**: Compilación ahead-of-time
- ✅ **Cache Headers**: Headers optimizados para cache

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error 404 en rutas**:
   - Verificar configuración de redirects
   - Asegurar que `_redirects` esté en la raíz del build

2. **Error de CORS**:
   - Configurar CORS en el backend
   - Verificar URL de API en environment.prod.ts

3. **Assets no cargan**:
   - Verificar configuración de base href
   - Revisar headers de cache

4. **Build falla**:
   - Verificar versión de Node.js (18+)
   - Limpiar cache: `npm run build:prod -- --delete-output-path`

### Comandos de Diagnóstico

```bash
# Verificar build localmente
ng serve --configuration production

# Verificar tamaño del bundle
ng build --configuration production --stats-json

# Limpiar y rebuild
rm -rf dist/
ng build --configuration production
```

## 📈 Monitoreo Post-Deploy

### Métricas a Monitorear

- **Performance**: Core Web Vitals
- **Errores**: Console errors, 404s
- **Uptime**: Disponibilidad del servicio
- **Bundle Size**: Tamaño de assets

### Herramientas Recomendadas

- **Vercel Analytics**: Métricas de performance
- **Netlify Analytics**: Estadísticas de uso
- **Google PageSpeed**: Análisis de performance
- **Lighthouse**: Auditoría completa

## 🔄 CI/CD Pipeline

### GitHub Actions (Opcional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build:prod
      - run: npm run deploy:vercel
```

## 📝 Checklist Pre-Deploy

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ API backend desplegada y accesible
- [ ] ✅ Tests pasando (`npm run test:ci`)
- [ ] ✅ Build exitoso (`npm run build:prod`)
- [ ] ✅ URLs de API actualizadas
- [ ] ✅ Configuración de CORS en backend
- [ ] ✅ Dominio personalizado (opcional)

## 🎯 URLs de Deploy

Una vez desplegado, tu aplicación estará disponible en:

- **Vercel**: `https://tu-proyecto.vercel.app`
- **Netlify**: `https://tu-proyecto.netlify.app`

---

**¡Deploy exitoso! 🚀**
