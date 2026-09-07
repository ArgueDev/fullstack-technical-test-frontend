# Sistema de Reserva de Entradas — Frontend

Aplicación web desarrollada con React y TypeScript para un sistema de reserva de entradas para eventos como parte de una prueba técnica Fullstack.

Permite consultar eventos, revisar su disponibilidad, realizar reservas y consultar las entradas reservadas. También incluye una sección para la administración de eventos.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Docker
- Nginx
- pnpm

## Funcionalidades

### Eventos

- Listado de eventos.
- Filtros por fecha, ubicación y disponibilidad.
- Detalle de eventos.
- Visualización de entradas disponibles.
- Interfaz responsive.

### Autenticación

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Persistencia de sesión.
- Rutas protegidas.
- Roles de usuario y administrador.
- Cierre de sesión.

### Reservas

- Selección de cantidad de entradas.
- Creación de reservas.
- Validación de disponibilidad.
- Manejo de entradas insuficientes.
- Confirmación de reserva.

### Perfil

- Información del usuario autenticado.
- Historial de reservas.
- Información del evento reservado.
- Cantidad de entradas reservadas.
- Visualización del ticket mediante un modal.

El código QR mostrado en el ticket es únicamente decorativo y no representa un sistema real de validación o check-in.

### Administración

Los usuarios con rol `admin` pueden:

- Crear eventos.
- Editar eventos.
- Eliminar eventos.
- Consultar los eventos existentes.

Los eventos que tengan reservas asociadas no pueden eliminarse. En ese caso, la interfaz muestra el mensaje correspondiente recibido desde la API.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Listado de eventos |
| `/events/:id` | Detalle y reserva |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/profile` | Perfil e historial de reservas |
| `/admin` | Administración de eventos |

Las rutas `/` y `/events/:id` son públicas.

La creación de una reserva requiere iniciar sesión. Si un usuario no autenticado intenta reservar, es redirigido al login y puede regresar posteriormente al detalle del evento.

`/profile` requiere una sesión autenticada.

`/admin` requiere una sesión con rol de administrador.

## Arquitectura

El frontend separa la interfaz, la gestión del estado del servidor, la comunicación con la API y la validación de datos.

```text
Page
  ↓
Custom Hook
  ↓
TanStack Query
  ↓
Service
  ↓
Axios
  ↓
Backend API
  ↓
Zod
  ↓
Datos tipados
```

Este flujo se utiliza principalmente para eventos, reservas, historial y operaciones administrativas.

La autenticación utiliza `AuthProvider` y `useAuth()` para compartir el estado de sesión.

Estructura principal:

```text
src/
├── api/
├── components/
├── context/
├── hooks/
├── pages/
├── schemas/
├── services/
├── utils/
└── ...
```

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.template`:

```bash
cp .env.template .env
```

Configuración por defecto:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` define la dirección del backend utilizada por el frontend.

Las variables `VITE_*` son públicas y se incorporan durante el build de Vite, por lo que no deben utilizarse para almacenar secretos.

El archivo `.env` está excluido del repositorio y del contexto de Docker.

## Ejecución local

### Requisitos

- Node.js
- pnpm

Instalar las dependencias:

```bash
pnpm install --frozen-lockfile
```

Crear las variables de entorno:

```bash
cp .env.template .env
```

Ejecutar el proyecto:

```bash
pnpm dev
```

Frontend:

```text
http://localhost:5173
```

El backend debe estar disponible en:

```text
http://localhost:3000
```

## Build de producción

Generar el build:

```bash
pnpm build
```

Vite genera los archivos de producción en:

```text
dist/
```

## Docker

El frontend utiliza un Dockerfile multi-stage.

La primera etapa utiliza Node.js y pnpm para instalar las dependencias y generar el build de Vite.

La segunda etapa utiliza Nginx para servir los archivos estáticos generados en `dist/`.

El contenedor expone internamente el puerto:

```text
80
```

### Construir la imagen

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:3000 \
  -t ticket-reservation-frontend .
```

### Ejecutar el contenedor

```bash
docker run --rm -p 5173:80 ticket-reservation-frontend
```

Abrir:

```text
http://localhost:5173
```

## React Router y Nginx

Nginx está configurado con fallback para aplicaciones SPA:

```nginx
try_files $uri $uri/ /index.html;
```

Esto permite abrir o actualizar directamente rutas como:

```text
/login
/register
/profile
/admin
/events/:id
```

sin obtener un error `404` de Nginx.

## Ejecutar el proyecto completo con Docker Compose

El `compose.yaml` que orquesta el sistema completo se encuentra en el repositorio backend.

Los dos repositorios deben encontrarse como carpetas hermanas:

```text
project/
├── fullstack-technical-test-backend/
└── fullstack-technical-test-frontend/
```

Después de configurar las variables de entorno del backend, ejecutar desde el repositorio backend:

```bash
docker compose up --build
```

Docker Compose levanta los siguientes servicios:

```text
MongoDB
   ↓
Inicialización del Replica Set
   ↓
Backend
   ↓
Frontend
```

Servicios disponibles:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

Cuando se utiliza Docker Compose no es necesario ejecutar `pnpm dev` manualmente.

## Comunicación con la API

Axios está configurado mediante un cliente centralizado.

La URL del backend se obtiene desde:

```text
VITE_API_URL
```

En el entorno Docker local se utiliza:

```text
http://localhost:3000
```

Esto es intencional, ya que las peticiones HTTP son realizadas por el navegador del usuario y no por el contenedor de Nginx.

## Manejo del estado

TanStack Query se utiliza para gestionar el estado proveniente del servidor, incluyendo:

- Listado de eventos.
- Detalle de eventos.
- Creación de reservas.
- Historial de reservas.
- Operaciones administrativas.
- Actualización de datos después de mutaciones.

## Formularios y validación

Los formularios utilizan React Hook Form junto con Zod para validación.

Zod también se utiliza para validar los datos recibidos desde diferentes respuestas de la API antes de utilizarlos en la aplicación.

## Autenticación

La autenticación utiliza JWT proporcionados por el backend.

El frontend:

- Mantiene la sesión del usuario.
- Añade el JWT a las solicitudes protegidas mediante Axios.
- Protege rutas privadas.
- Diferencia las interfaces de usuario y administrador.
- Maneja respuestas no autorizadas.
- Elimina la sesión al cerrar sesión o cuando la autenticación deja de ser válida.

La autorización y las reglas de seguridad de la API son responsabilidad del backend. La protección de rutas del frontend funciona como control de navegación e interfaz.

## Flujo de reserva

```text
Detalle del evento
        ↓
Seleccionar cantidad
        ↓
Realizar reserva
        ↓
POST /reservations
        ↓
Confirmación
        ↓
Actualizar disponibilidad
        ↓
Reserva disponible en Perfil
```

## Manejo de errores

La interfaz contempla diferentes situaciones provenientes de la API:

- Datos inválidos.
- Sesión no válida.
- Acceso no autorizado.
- Evento inexistente.
- Entradas insuficientes.
- Eventos con reservas que no pueden eliminarse.
- Problemas de conexión.

## Diseño responsive

La interfaz fue desarrollada con Tailwind CSS y se adapta a diferentes tamaños de pantalla.

## Pruebas

El proyecto incluye pruebas unitarias en:

```text
test/*.test.mjs
```

Las pruebas cubren principalmente schemas, validaciones, manejo de errores y funcionalidades relacionadas con la sesión.

Ejecutar desde la raíz del frontend:

```bash
node --experimental-strip-types --test test/*.test.mjs
```

Actualmente la suite contiene **13 pruebas automatizadas**.

## Calidad de código

Ejecutar el linter:

```bash
pnpm lint
```

Validar el build de producción:

```bash
pnpm build
```

## Gestor de paquetes

El proyecto utiliza pnpm.

```bash
pnpm install --frozen-lockfile
```