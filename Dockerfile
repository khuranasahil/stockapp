# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy the parent POM and module POMs first for better layer caching
COPY pom.xml .
COPY frontend/pom.xml frontend/
COPY backend/pom.xml backend/

# Copy source code
COPY frontend/ frontend/
COPY backend/ backend/

# Build both modules using Maven
RUN mvn clean package -DskipTests

# Final stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR (which includes frontend static resources)
COPY --from=builder /app/backend/target/backend-1.0.0-SNAPSHOT.jar app.jar

# Run the application with port 80
ENV PORT=80
EXPOSE ${PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
