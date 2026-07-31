FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /workspace/app

COPY . .
RUN --mount=type=cache,target=/root/.m2 ./mvnw clean package -pl services/dashboard-service -am -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/services/dashboard-service/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
