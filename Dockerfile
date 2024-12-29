# Clean static files before build\nRUN rm -rf /app/backend/target/* /app/backend/src/main/resources/static/assets/*
# Build frontend
FROM node:18-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
# Copy parent pom first
COPY pom.xml /app/
# Copy backend module
COPY backend/pom.xml /app/backend/
COPY backend/src /app/backend/src
# Build from parent directory
RUN mvn -f /app/backend/pom.xml clean package -DskipTests

# Final image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy frontend build to backend resources
COPY --from=frontend-build /app/frontend/dist/ /app/backend/src/main/resources/static/
COPY --from=backend-build /app/backend/target/backend-1.0.0-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
