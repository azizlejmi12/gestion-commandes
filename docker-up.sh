#!/bin/bash

# Script de construction et démarrage de l'application avec Docker Compose

set -e

echo "================================"
echo "🐳 Gestion des Commandes - Docker"
echo "================================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'affichage
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Vérifier que Docker et Docker Compose sont installés
if ! command -v docker &> /dev/null; then
    log_warning "Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_warning "Docker Compose n'est pas installé"
    exit 1
fi

log_success "Docker et Docker Compose détectés"

# Option 1: Build complet
if [[ "$1" == "build" ]]; then
    log_info "Reconstruction des images Docker..."
    docker-compose build --no-cache
    log_success "Images construites avec succès"
    exit 0
fi

# Option 2: Démarrage simple
if [[ "$1" == "start" ]]; then
    log_info "Démarrage des services..."
    docker-compose up -d
    log_success "Services démarrés"
    log_info "Frontend: http://localhost"
    log_info "Backend API: http://localhost:8081"
    log_info "MySQL: localhost:3306"
    exit 0
fi

# Option 3: Arrêt des services
if [[ "$1" == "stop" ]]; then
    log_info "Arrêt des services..."
    docker-compose down
    log_success "Services arrêtés"
    exit 0
fi

# Option 4: Logs
if [[ "$1" == "logs" ]]; then
    docker-compose logs -f
    exit 0
fi

# Option 5: État
if [[ "$1" == "status" ]]; then
    log_info "État des services:"
    docker-compose ps
    exit 0
fi

# Comportement par défaut: Build et démarrage
log_info "Mode par défaut: construction et démarrage"
log_info "Options disponibles:"
echo "  - $0 build   : Reconstruire les images"
echo "  - $0 start   : Démarrer les services"
echo "  - $0 stop    : Arrêter les services"
echo "  - $0 logs    : Afficher les logs"
echo "  - $0 status  : Afficher l'état des services"
echo ""

log_info "Construction des images..."
docker-compose build

log_info "Démarrage des services..."
docker-compose up -d

log_success "Application démarrée!"
echo ""
log_info "Accès à l'application:"
echo "  🌐 Frontend: ${GREEN}http://localhost${NC}"
echo "  🔌 Backend API: ${GREEN}http://localhost:8081${NC}"
echo "  🗄️  MySQL: ${GREEN}localhost:3306${NC}"
echo ""
log_info "Logs: docker-compose logs -f"
log_info "Arrêt: docker-compose down"
