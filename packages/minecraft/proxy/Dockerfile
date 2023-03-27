FROM openjdk:17-jdk-alpine
LABEL com.minechain.name="Minechain Velocity Server"
LABEL com.minechain.image.authors="mail@carsonweeks.com"
WORKDIR /app

RUN apk add --no-cache gomplate

ENV MOTD="Velocity Server"
ENV REGISTRATION_IP="0.0.0.0"
ENV REGISTRATION_PORT="25565"
ENV FORWARDING_SECRET="my_secret"
ENV RABBITMQ_IP="localhost"
ENV RABBITMQ_PORT="5672"

RUN wget https://api.papermc.io/v2/projects/velocity/versions/3.2.0-SNAPSHOT/builds/225/downloads/velocity-3.2.0-SNAPSHOT-225.jar
RUN mkdir plugins

COPY packages/minecraft/proxy/config/ ./
RUN chmod +x /app/start.sh

COPY dist/packages/minecraft-proxy/app/minechain*.jar ./plugins/

EXPOSE 25577
CMD ./start.sh