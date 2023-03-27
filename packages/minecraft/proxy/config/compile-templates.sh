#! /bin/sh
gomplate -f velocity.toml.t -o velocity.toml
gomplate -f forwarding.secret.t -o forwarding.secret
mkdir -p ./plugins/minechain-velocity/
gomplate -f config.toml.t -o ./plugins/minechain-velocity/config.toml

