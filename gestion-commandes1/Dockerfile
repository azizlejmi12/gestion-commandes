# Étape 1 : Builder - Construire l'application Spring Boot
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copier les fichiers pom
COPY pom.xml .

# Télécharger les dépendances
RUN mvn dependency:go-offline

# Copier le code source
COPY src/ src/

# Construire l'application
RUN mvn clean package -DskipTests

# Étape 2 : Production - Exécuter l'application
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR depuis l'étape builder
COPY --from=builder /app/target/*.jar app.jar

# Définir les variables d'environnement par défaut
ENV SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/gestion_commandes?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_JPA_SHOW_SQL=false
ENV SERVER_PORT=8081

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
