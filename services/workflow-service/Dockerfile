FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /workspace/app

COPY . .
RUN --mount=type=cache,target=/root/.m2 ./mvnw clean package -pl services/workflow-service -am -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/services/workflow-service/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
