# --- Etapa 1: Build ---
FROM node:24-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar build
RUN npm run build


# --- Etapa 2: Servir con NGINX ---
FROM nginx:alpine

# Copiar el build a la carpeta pública de nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
