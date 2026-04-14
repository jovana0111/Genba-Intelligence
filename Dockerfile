# Etapa de construcción
FROM node:20-alpine AS build

# Deshabilitar telemetría de herramientas
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Instalar dependencias primero (aprovechar cache de Docker)
COPY package*.json ./
RUN npm install --frozen-lockfile || npm install

# Copiar el resto y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de Nginx para manejar SPA y usar el puerto dinámico de Render
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Render asigna dinámicamente el puerto a la variable $PORT.
# Este comando reemplaza el puerto 80 por el valor de $PORT al iniciar el contenedor.
CMD /bin/sh -c "sed -i 's/listen 80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
