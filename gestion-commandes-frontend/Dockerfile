# Étape 1 : Builder - Construire l'application Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build -- --configuration production

# Étape 2 : Production - Servir avec Nginx
FROM nginx:1.25-alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist/gestion-commandes-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
