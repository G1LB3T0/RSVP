# Usar imagen oficial de Node.js
FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de archivos del proyecto
COPY . .

# Exponer el puerto 5173 (puerto por defecto de Vite)
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo
CMD ["npm", "run", "dev"]
