# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar una configuración personalizada de nginx para manejar SPA (Single Page Application)
# Esto es vital para que las rutas internas de React funcionen correctamente en producción
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
