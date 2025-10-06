# 🚀 FinExus Frontend - Gestión de Productos

Una aplicación Angular moderna para la gestión de productos con arquitectura modular, lazy loading y pruebas unitarias completas.

## 📋 Tabla de Contenidos

- [Objetivo del Proyecto](#objetivo-del-proyecto)
- [Requerimientos Previos](#requerimientos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Extensión de la Solución](#extensión-de-la-solución)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [API Backend](#api-backend)

## 🎯 Objetivo del Proyecto

FinExus Frontend es una aplicación web desarrollada en Angular que permite la gestión completa de productos, incluyendo:

- **CRUD de Productos**: Crear, leer, actualizar y eliminar productos
- **Interfaz Responsiva**: Diseño moderno y adaptable a diferentes dispositivos
- **Validaciones en Tiempo Real**: Formularios reactivos con validaciones robustas
- **Manejo de Errores**: Sistema centralizado de manejo de errores HTTP
- **Loading States**: Indicadores de carga globales
- **Notificaciones**: Sistema de toast para feedback al usuario
- **Arquitectura Modular**: Estructura escalable con lazy loading
- **Pruebas Unitarias**: Cobertura completa con Jasmine/Karma

## 🔧 Requerimientos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior)
- **npm** (versión 9.x o superior) o **yarn**
- **Angular CLI** (versión 17.x o superior)
- **Git**

### Verificar Instalaciones

```bash
node --version
npm --version
ng version
git --version
```

### Instalar Angular CLI (si no está instalado)

```bash
npm install -g @angular/cli
```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ravelojhon/front-finexus.git
cd front-finexus
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

El proyecto utiliza variables de entorno para la configuración de la API. Verifica que el archivo `src/environments/environment.ts` esté configurado correctamente:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
```

## ▶️ Ejecución del Proyecto

### Servidor de Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### Servidor de Desarrollo con Puerto Específico

```bash
ng serve --port 4201
```

### Build para Producción

```bash
ng build --prod
```

Los archivos compilados se generarán en la carpeta `dist/`

### Servidor de Producción

```bash
ng serve --configuration production
```

## 🧪 Pruebas

### Ejecutar Todas las Pruebas

```bash
ng test
```

### Ejecutar Pruebas en Modo Headless

```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Ejecutar Pruebas con Cobertura

```bash
ng test --code-coverage
```

### Ejecutar Pruebas Específicas

```bash
ng test --include="**/product.service.spec.ts"
```

### Resultados de Pruebas

- **Total de Pruebas**: 46
- **Cobertura**: 100% de funcionalidades críticas
- **Tiempo de Ejecución**: ~1.2 segundos
- **Frameworks**: Jasmine + Karma

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                           # Módulo central
│   │   ├── components/                 # Componentes globales
│   │   │   ├── global-loading/        # Spinner de carga global
│   │   │   └── toast/                 # Sistema de notificaciones
│   │   ├── interceptors/              # Interceptores HTTP
│   │   │   ├── error.interceptor.ts   # Manejo de errores
│   │   │   └── loading.interceptor.ts # Control de loading
│   │   ├── models/                    # Interfaces y tipos
│   │   │   └── product.interface.ts   # Tipos de productos
│   │   ├── services/                  # Servicios centrales
│   │   │   ├── product.service.ts     # Servicio de productos
│   │   │   ├── loading.service.ts     # Servicio de loading
│   │   │   └── toast.service.ts       # Servicio de notificaciones
│   │   └── core.module.ts             # Módulo core
│   ├── features/                      # Módulos de funcionalidades
│   │   └── products/                  # Módulo de productos
│   │       ├── components/            # Componentes específicos
│   │       │   ├── list/              # Lista de productos
│   │       │   ├── form/              # Formulario de productos
│   │       │   └── detail/            # Detalle de productos
│   │       └── products.routes.ts     # Rutas del módulo
│   ├── shared/                        # Componentes compartidos
│   ├── app.routes.ts                  # Rutas principales
│   ├── app.config.ts                  # Configuración de la app
│   └── app.ts                         # Componente raíz
├── assets/                            # Recursos estáticos
├── environments/                      # Variables de entorno
└── styles.scss                       # Estilos globales
```

## ⚡ Funcionalidades

### 🛍️ Gestión de Productos

- **Lista de Productos**: Vista tabular con paginación y filtros
- **Crear Producto**: Formulario con validaciones en tiempo real
- **Editar Producto**: Formulario pre-poblado con datos existentes
- **Ver Detalle**: Vista detallada de un producto específico
- **Eliminar Producto**: Confirmación antes de eliminar

### 🔧 Características Técnicas

- **Arquitectura Modular**: Separación clara de responsabilidades
- **Lazy Loading**: Carga diferida de módulos para mejor rendimiento
- **Componentes Standalone**: Arquitectura moderna de Angular
- **Reactive Forms**: Formularios reactivos con validaciones robustas
- **HTTP Interceptors**: Manejo centralizado de peticiones HTTP
- **Error Handling**: Sistema robusto de manejo de errores
- **Loading States**: Indicadores de carga globales
- **Toast Notifications**: Sistema de notificaciones al usuario

### 🎨 Interfaz de Usuario

- **Diseño Responsivo**: Adaptable a móviles, tablets y desktop
- **Bootstrap 5**: Framework CSS moderno
- **FontAwesome**: Iconografía consistente
- **UX Optimizada**: Flujos de usuario intuitivos

## 🔧 Extensión de la Solución

### Agregar Nuevas Funcionalidades

1. **Crear Nuevo Módulo de Funcionalidad**:

```bash
ng generate module features/nueva-funcionalidad
ng generate component features/nueva-funcionalidad/components/lista
```

2. **Configurar Lazy Loading**:

```typescript
// app.routes.ts
{
  path: 'nueva-funcionalidad',
  loadChildren: () => import('./features/nueva-funcionalidad/nueva-funcionalidad.module')
    .then(m => m.NuevaFuncionalidadModule)
}
```

3. **Agregar Servicios**:

```bash
ng generate service core/services/nuevo-servicio
```

### Agregar Nuevos Componentes

```bash
ng generate component shared/components/nuevo-componente
```

### Agregar Nuevas Pruebas

```bash
ng generate service core/services/nuevo-servicio --skip-tests=false
ng generate component features/products/components/nuevo --skip-tests=false
```

### Configurar Nuevos Interceptores

1. Crear el interceptor:
```bash
ng generate interceptor core/interceptors/nuevo-interceptor
```

2. Registrarlo en `app.config.ts`:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NuevoInterceptor,
    multi: true
  }
]
```

### Personalizar Estilos

- **Variables SCSS**: Modifica `src/styles.scss`
- **Temas**: Implementa temas personalizados
- **Componentes**: Estilos específicos en cada componente

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 17+**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **Bootstrap 5**: Framework CSS
- **FontAwesome**: Iconografía
- **SCSS**: Preprocesador CSS

### Testing
- **Jasmine**: Framework de testing
- **Karma**: Test runner
- **Angular Testing Utilities**: Utilidades de testing

### Herramientas de Desarrollo
- **Angular CLI**: Herramientas de línea de comandos
- **ESLint**: Linter de código
- **Prettier**: Formateador de código
- **Git**: Control de versiones

## 🔌 API Backend

### Endpoints Disponibles

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api` - Verificar estado de la API
- `GET /api/products/test` - Verificar conexión con BD

### Configuración de API

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'  // URL de tu API backend
};
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo
ng serve --port 4201       # Puerto específico

# Build
ng build                    # Build de desarrollo
ng build --prod            # Build de producción

# Testing
ng test                     # Ejecutar pruebas
ng test --watch=false      # Pruebas una sola vez
ng test --code-coverage    # Con cobertura

# Generación de código
ng generate component       # Nuevo componente
ng generate service         # Nuevo servicio
ng generate module          # Nuevo módulo
ng generate interceptor     # Nuevo interceptor
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Ravelo Jhon** - *Desarrollo inicial* - [ravelojhon](https://github.com/ravelojhon)

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:

- Abrir un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de Angular

---

**¡Gracias por usar FinExus Frontend! 🚀**