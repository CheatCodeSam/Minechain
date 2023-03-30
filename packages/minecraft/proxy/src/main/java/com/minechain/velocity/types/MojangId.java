package com.minechain.velocity.types;

import java.util.UUID;

public class MojangId {
    UUID uuid;

    public MojangId(UUID uuid) {
        this.uuid = uuid;
    }

    public UUID getUuid() {
        return uuid;
    }

}
