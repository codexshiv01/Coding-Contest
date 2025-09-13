FROM openjdk:17-jdk-slim

# Install Maven, Docker CLI and dos2unix
RUN apt-get update && \
    apt-get install -y maven docker.io dos2unix && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml ./

# Download dependencies using Maven directly
RUN mvn dependency:resolve

# Copy Maven wrapper (optional, for compatibility)
COPY .mvn/ .mvn/
COPY mvnw ./

# Fix line endings and make Maven wrapper executable
RUN dos2unix ./mvnw && \
    chmod +x ./mvnw

# Copy source code
COPY src ./src

# Build the application using Maven directly
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/coding-contest-backend-1.0.0.jar"]
