# Vehicle Tracker APP 🚗📍

Una aplicación web en tiempo real para el seguimiento y gestión de vehículos, construida con Vue 3 y tecnologías modernas.

## Características Principales

### Autenticación y Autorización

Sistema de registro e inicio de sesión con JWT
Dos tipos de usuarios: Admin y Usuario Normal
Protección de rutas según el rol del usuario

Funcionalidades por Rol

- Usuario Normal

✅ Cambiar su contraseña  
✅ Crear vehículos  
✅ Ver sus propios vehículos  
✅ Ver detalles completos de cada vehículo.  
✅ Actualizar ubicación (longitud y latitud).  
✅ Editar información de vehículos.  
✅ Desactivar vehículos.

- Administrador
  Además de todas las funcionalidades del usuario normal:

✅ Crear nuevos usuarios  
✅ Ver listado de usuarios  
✅ Crear vehiculos para otros usuarios  
✅ Ver todos los vehículos del sistema  
✅ Filtrado de vehículos

### Seguimiento en Tiempo Real

🗺️ Mapas interactivos con Leaflet  
⚡ Actualización en tiempo real mediante Socket.io  
📡 Sincronización automática de coordenadas vía MQTT  
🔄 Actualización instantánea cuando usuarios o el servidor modifican datos

### Tecnologías Utilizadas

- Node.js (v24.11.1)

Frontend

Vue 3 - Framework principal  
Vue Router - Navegación y protección de rutas  
Tailwind CSS - Estilos y diseño responsivo  
Leaflet - Mapas interactivos  
SweetAlert2 - Alertas y notificaciones elegantes

Comunicación y Autenticación

Socket.io - Comunicación en tiempo real  
JWT - Autenticación y autorización  
Swagger - Documentación de API  
MQTT - Protocolo de mensajería para actualización de coordenadas

### Estructura de Rutas

```
/                    - Página de autenticación (login/registro)
/dashboard           - Panel principal (requiere autenticación)
/vehicle/:id         - Detalle de vehículo específico (requiere autenticación)
```

### Sistema de Autenticación

#### Registro

Los usuarios pueden registrarse como usuario normal o administrador  
Validación de credenciales mediante JWT

#### Inicio de Sesión

Autenticación segura con tokens JWT  
Redirección automática según el estado de autenticación

#### Protección de Rutas

Middleware de autenticación en Vue Router  
Redirección automática para usuarios no autenticados  
Protección de rutas administrativas

### Sistema de Mapas

Visualización de vehículos en tiempo real  
Actualización automática de posiciones  
Marcadores interactivos en el mapa  
Sincronización bidireccional (cliente-servidor)

### Instalación

```bash
npm install
```

## Modo desarrollo

```
npm run dev
```

## Compilar para producción

```
npm run build
```

## Configuración

Asegúrate de configurar las variables de entorno necesarias:

```
envVITE_API_URL=your_api_url
VITE_SOCKET_URL=your_socket_url
```

## Casos de Uso

- Seguimiento de flotas: Administradores pueden monitorear todos los vehículos en tiempo real
- Gestión individual: Usuarios normales gestionan sus propios vehículos
- Actualización remota: El servidor puede actualizar posiciones mediante MQTT
- Gestión de usuarios: Administradores pueden crear y gestionar cuentas de usuario

## Flujo de Actualización en Tiempo Real

- Usuario o servidor actualiza coordenadas
- Mensaje se envía vía Socket.io/MQTT.
- Todos los clientes conectados reciben la actualización
- Los mapas se actualizan automáticamente sin recargar la página.

## Responsividad

La aplicación está completamente optimizada para:

- 💻 Desktop
- 📱 Tablet
- 📱 Mobile
