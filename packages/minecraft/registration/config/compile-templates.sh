#! /bin/sh
gomplate -f /opt/minecraft/server.properties.t -o /data/server.properties
mkdir -p ./config/
gomplate -f /opt/minecraft/paper-global.yml.t -o /data/config/paper-global.yml