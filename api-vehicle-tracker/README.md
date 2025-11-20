# 🚗 Vehicle Tracker API

API desarrollada con **Node.js**, **Express**, **Sequelize** y **PostgreSQL**, que permite registrar y consultar usuarios, vehículos y posiciones geográficas en tiempo real.

---

## Tecnologías utilizadas

- Node.js (v24.11.1)
- Express
- PostgreSQL
- Sequelize ORM
- Socket.IO
- MQTT (para comunicación de coordenadas)
- JWT (autenticación)
- bcrypt (encriptación de contraseñas)

---

## Instalación y configuración

### 1 Clonar el repositorio

```bash
git clone https://github.com/tuusuario/vehicle-tracker.git
cd vehicle-tracker
```

### 2 Instalar Dependencias

```bash
npm install
```

### 3 Configurar las variables de entorno

Crea un archivo .env en la raíz del proyecto con el siguiente contenido (ajusta los valores según tus entorno):

```
PORT=3000
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
BD_DATABASE=vehicle_db
JWT_SECRET=tu_clave_secreta
MQTT_BROKER_URL=mqtt://test.mosquitto.org
```

### 4 Migraciones y Seeders

- Este comando creará la base de datos.

```bash
npm run db:create
```

- Esto creará las tablas users, vehicles y positions en tu base de datos.

```bash
npm run db:migrate
```

- Crear datos de prueba.

```bash
npm run db:seed
```

#### Usuario de Prueba Creado

- ADMIN: ADMIN@EXAMPLE.COM / Password123.

### 5 Iniciar el servidor

```bash
npm run dev
```

## Endpoints principales

| Método | Ruta              | Descripción                                               |
| ------ | ----------------- | --------------------------------------------------------- |
| `POST` | `/positions`      | Registrar una nueva posición (coordenada) de un vehículo. |
| `GET`  | `/positions/{id}` | Obtener las posiciones de un vehículo específico.         |

| Método | Ruta                     | Descripción                               |
| ------ | ------------------------ | ----------------------------------------- |
| `POST` | `/users/register`        | Registrar un nuevo usuario.               |
| `POST` | `/users/auth`            | Iniciar sesión (correo y contraseña).     |
| `PUT`  | `/users/change-password` | Cambiar la contraseña del usuario actual. |
| `GET`  | `/users/{id}`            | Obtener todos los usuarios activos.       |

| Método   | Ruta                    | Descripción                            |
| -------- | ----------------------- | -------------------------------------- |
| `POST`   | `/api/v1/vehicles`      | Crear un nuevo vehículo.               |
| `PUT`    | `/api/v1/vehicles`      | Actualizar información de un vehículo. |
| `DELETE` | `/api/v1/vehicles`      | Inactivar un vehículo existente.       |
| `GET`    | `/api/v1/vehicles`      | Obtener todos los vehículos activos.   |
| `GET`    | `/api/v1/vehicles/{id}` | Obtener un vehículo por ID.            |

## Estructura del proyecto

```
src/
├── database/
│ └── config.js
├── controllers/
│ ├── error.controller.js
│ ├── position.controller.js
│ ├── user.controller.js
│ └── vehicles.controller.js
├── middlewares/
│ ├── auth.middleware.js
│ └── validations.middleware.js
├── models/
│ ├── init_model.js
│ ├── users.model.js
│ ├── vehicles.model.js
│ └── positions.model.js
├── migrations/
│ ├── 20251113XXXXXX-create-users.js
│ ├── 20251113XXXXXX-create-vehicles.js
│ └── 20251113XXXXXX-create-positions.js
├── sockets/
│ └── socket.js
├── mqtt/
│ └── mqtt.client.js
├── routes/
│ ├── api/
│ └── index.js
├── swagger/
│ └── swaggerConfig.js
├── utils/
│ ├── appError.js
│ └── catchAsync.js
├── index.js
└── server.js
```

## Autenticación

La API utiliza JSON Web Tokens (JWT).
Al iniciar sesión (/users/auth), el servidor devuelve un token que debe enviarse en el header de las rutas protegidas:

```
Authorization: Bearer <tu_token_aquí>
```

## Comunicación MQTT + Socket.IO

El servidor se conecta a un broker MQTT para recibir las coordenadas publicadas en el tópico:

```
vehicle/{id}/positions
```

Cada vez que llega una posición nueva, se emite un evento por Socket.IO a los clientes conectados para actualizar el mapa en tiempo real.

## Autor

Jesús Antonio Pichardo Ríos  
Desarrollador Full Stack — Node.js / Vue / PostgreSQL  
2025
