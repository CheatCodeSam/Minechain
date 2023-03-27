FROM eclipse-temurin:17-jre
ARG TARGETARCH
# Install gosu
RUN set -eux; \
 apt-get update; \
 apt-get install -y gosu; \
 rm -rf /var/lib/apt/lists/*; \
# verify that the binary works
 gosu nobody true

COPY --from=hairyhenderson/gomplate:stable /gomplate /bin/gomplate

# Working directory
WORKDIR /data

RUN mkdir -p /opt/minecraft/
# Explicit paperMC Version
RUN wget https://api.papermc.io/v2/projects/paper/versions/1.19.3/builds/388/downloads/paper-1.19.3-388.jar -O /opt/minecraft/paperspigot.jar

# Install and run rcon
ARG RCON_CLI_VER=1.6.0
ADD https://github.com/itzg/rcon-cli/releases/download/${RCON_CLI_VER}/rcon-cli_${RCON_CLI_VER}_linux_${TARGETARCH}.tar.gz /tmp/rcon-cli.tgz
RUN tar -x -C /usr/local/bin -f /tmp/rcon-cli.tgz rcon-cli && \
  rm /tmp/rcon-cli.tgz

# Volumes for the external data (Server, World, Config...)
VOLUME "/data"

# Expose minecraft port
EXPOSE 25565/tcp
EXPOSE 25565/udp

#Pl3xmap port
EXPOSE 8080/tcp

# Set memory size
ARG memory_size=1G
ENV MEMORYSIZE=$memory_size

# Set Java Flags
ARG java_flags="-Dlog4j2.formatMsgNoLookups=true -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=mcflags.emc.gs -Dcom.mojang.eula.agree=true"
ENV JAVAFLAGS=$java_flags

# Set PaperMC Flags
ARG papermc_flags="--nojline"
ENV PAPERMC_FLAGS=$papermc_flags

WORKDIR /data

RUN mkdir plugins

COPY packages/minecraft/registration/config/ /opt/minecraft
RUN chmod +x /opt/minecraft/compile-templates.sh
RUN chmod +x /opt/minecraft/start.sh

COPY dist/packages/minecraft-registration/app/*.jar /data/plugins/

ENV LEVEL_SEED=glacier
ENV FORWARDING_SECRET=my_secret

# Entrypoint
CMD /opt/minecraft/compile-templates.sh && /opt/minecraft/start.sh