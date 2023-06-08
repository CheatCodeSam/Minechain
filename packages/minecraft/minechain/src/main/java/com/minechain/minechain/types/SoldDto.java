package com.minechain.minechain.types;

import java.util.UUID;

public class SoldDto {
    private Property property;
    private Integer tokenId;

    public Integer getTokenId() {
        return tokenId;
    }

    public Property getProperty() {
        return property;
    }

    public class Property {
        private Owner owner;

        public Owner getOwner() {
            return owner;
        }

        public class Owner {
            private UUID mojangId;

            public UUID getMojangId() {
                return mojangId;
            }
        }
    }
}
