# Use OpenJDK 17 as base image
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY backend/target/backend-1.0.0-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
