# 🐳 Docker - Gestion des Commandes

## 📋 Prérequis

- Docker
- Docker Compose

## 🚀 Démarrage

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier l'état
docker-compose ps
```

Le service MySQL n'expose plus le port 3306 sur la machine Windows pour éviter les conflits si MySQL est déjà installé localement.

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Compose Network              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐    ┌──────────────┐     │
│  │  Frontend    │    │  Backend     │     │
│  │  (Nginx)     │───▶│  (Spring     │     │
│  │  Port 80     │    │   Boot)      │     │
│  │              │    │  Port 8081   │     │
│  └──────────────┘    └──────┬───────┘     │
│                             │              │
│                      ┌──────▼──────┐      │
│                      │   MySQL     │      │
│                      │  Port 3306  │      │
│                      └─────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

## 🛠️ Commandes Essentielles

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose build --no-cache
```

### Accès aux Services

- **Frontend (Angular)**: http://localhost
 - **Frontend (Angular)**: http://localhost:8085
 - **Backend (Spring Boot)**: http://localhost:8084
- **API Backend**: http://localhost:8081/api/
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **MySQL**: localhost:3306 (root/root)

## 📝 Configuration

### Variables d'Environnement

Le fichier `docker-compose.yml` configure automatiquement:

**Base de données:**
- `MYSQL_ROOT_PASSWORD`: root
- `MYSQL_DATABASE`: gestion_commandes
- `MYSQL_CHARSET`: utf8mb4

**Backend (Spring Boot):**
- `SERVER_PORT`: 8081
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: update (crée les tables automatiquement)

### Accès à la Base de Données

```bash
# Depuis votre machine
mysql -h localhost -P 3306 -u root -proot gestion_commandes

# Depuis un conteneur
docker exec -it gestion-commandes-db mysql -u root -proot gestion_commandes
```

## � Accès à l'Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081/api/
- **MySQL**: accessible uniquement depuis les autres conteneurs Docker

## 🔍 Dépannage

### Le conteneur backend refuse de se connecter à la DB

```bash
# Vérifier la santé de MySQL
docker-compose ps

# Voir les logs du backend
docker-compose logs backend

# Attendre que MySQL soit prêt (30 secondes)
docker-compose down && docker-compose up -d
```

### Le Frontend affiche une erreur CORS

Cela est normalement résolu par la configuration nginx. Vérifier:
```bash
docker-compose logs frontend
```

### Réinitialiser complètement

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker-compose down -v --rmi all

# Relancer
./docker-up.sh
```

### Problèmes de port

Si les ports 80, 8081 ou 3306 sont déjà utilisés:

1. Modifier `docker-compose.yml`:
```yaml
services:
  db:
    ports:
    � Problèmes Courants

**Ports déjà utilisés?** Modifier les ports dans `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"      # Lieu de 80
backend:
  ports:
    - "8082:8081"    # Lieu de 8081
```

**Réinitialiser complètement?**
```bash
