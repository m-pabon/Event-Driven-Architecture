FROM azul/zulu-openjdk-alpine:11
COPY build/libs/dependency-jars /run/dependency-jars
ADD build/libs/orders-0.0.1-SNAPSHOT.jar /run/application.jar

ENTRYPOINT java -jar run/application.jar