# Vehicle Tracker – Deploy

Este repositorio contiene la configuración necesaria para ejecutar toda la aplicación Vehicle Tracker usando Docker Compose:

- Node.js (v24.11.1)
- Frontend: Vue 3 (Vite + Tailwind)
- Backend: Node.js + Express + Socket.IO + MQTT + Sequelize
- Base de datos: PostgreSQL 16
- Seeds automáticos mediante Sequelize CLI

## Requisitos previos

- Docker
- Docker Compose
- (Opcional) TablePlus / DBeaver para ver la base de datos

Estructura del proyecto

```
vehicle-tracker-deploy/
   ├── front-vehicle-tracker/
   │     ├── src/
   │     ├── Dockerfile
   │     └── .env.example
   │
   ├── api-vehicle-tracker/
   │     ├── src/
   │     ├── Dockerfile
   │     └── .env.example
   │
   ├── docker-compose.yml
   ├── README.md
   └── .gitignore
```

## Variables de entorno

Cada servicio tiene su .env.example.
Debes copiarlos:

- cp api-vehicle-tracker/.env.example api-vehicle-tracker/.env
- cp front-vehicle-tracker/.env.example front-vehicle-tracker/.env

Editar y colocar tus valores reales.

## Levantar el proyecto completo

```bash
docker compose up --build
```

Esto:

- Construye backend y frontend
- Inicia PostgreSQL
- Ejecuta migraciones
- Ejecuta seeds
- Levanta Vue en puerto 80
- Levanta API en puerto 3000

## Acceder a los servicios

| Servicio | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | [http://localhost](http://localhost)           |
| Backend  | [http://localhost:3000](http://localhost:3000) |
| Postgre  | localhost:5432                                 |

## Conectar a la base de datos

Ejemplo (TablePlus / DBeaver):

| Campo    | Valor              |
| -------- | ------------------ |
| Host     | localhost          |
| Port     | 5432               |
| User     | postgres           |
| Password | postgres           |
| Database | vehicle_tracker_db |

## Detener contenedores

```bash
docker compose down
```

## Para borrar datos de la base:

```bash
docker compose down -v
```

## Notas finales

Los .env están excluidos por seguridad → no se suben al repo.

Puedes extender este compose para producción (Nginx, SSL, VPS, etc.)
