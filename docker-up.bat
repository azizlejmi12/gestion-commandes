@echo off

REM Script de construction et démarrage de l'application avec Docker Compose (Windows)

setlocal enabledelayedexpansion

echo.
echo ================================
echo 🐳 Gestion des Commandes - Docker
echo ================================
echo.

REM Vérifier que Docker est installé
docker --version > nul 2>&1
if errorlevel 1 (
    echo [!] Docker n'est pas installé ou n'est pas dans PATH
    exit /b 1
)

echo [✓] Docker détecté

REM Traiter les arguments
if "%1"=="build" (
    echo [INFO] Reconstruction des images Docker...
    docker-compose build --no-cache
    echo [✓] Images construites avec succès
    exit /b 0
)

if "%1"=="start" (
    echo [INFO] Démarrage des services...
    docker-compose up -d
    echo [✓] Services démarrés
    echo [INFO] Accès à l'application:
    echo   - Frontend: http://localhost
    echo   - Backend API: http://localhost:8081
    echo   - MySQL: localhost:3306
    exit /b 0
)

if "%1"=="stop" (
    echo [INFO] Arrêt des services...
    docker-compose down
    echo [✓] Services arrêtés
    exit /b 0
)

if "%1"=="logs" (
    docker-compose logs -f
    exit /b 0
)

if "%1"=="status" (
    echo [INFO] État des services:
    docker-compose ps
    exit /b 0
)

REM Comportement par défaut: Build et démarrage
echo [INFO] Mode par défaut: construction et démarrage
echo.
echo Options disponibles:
echo   - docker-up.bat build   : Reconstruire les images
echo   - docker-up.bat start   : Démarrer les services
echo   - docker-up.bat stop    : Arrêter les services
echo   - docker-up.bat logs    : Afficher les logs
echo   - docker-up.bat status  : Afficher l'état des services
echo.

echo [INFO] Construction des images...
docker-compose build

echo.
echo [INFO] Démarrage des services...
docker-compose up -d

echo.
echo [✓] Application démarrée!
echo.
echo [INFO] Accès à l'application:
echo   - Frontend: http://localhost
echo   - Backend API: http://localhost:8081
echo   - MySQL: localhost:3306
echo.
echo [INFO] Commandes utiles:
echo   - Voir les logs: docker-compose logs -f
echo   - Arrêter: docker-compose down
echo   - État: docker-compose ps
echo.
