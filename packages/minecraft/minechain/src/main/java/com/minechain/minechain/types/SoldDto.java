package com.minechain.minechain.types;

import java.util.UUID;

public class SoldDto {
    private Property property;
    private Integer tokenId;
    private String from;
    private String to;
    private String price;

    public class Property {
        private Owner owner;

        public class Owner {
            private UUID mojangId;
            private String displayName;

            public String getDisplayName() {
                return displayName;
            }

            public UUID getMojangId() {
                return mojangId;
            }

        }

        public Owner getOwner() {
            return owner;
        }
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public Integer getTokenId() {
        return tokenId;
    }

    public Property getProperty() {
        return property;
    }

    public Boolean hasLinkedAccount() {
        return this.getProperty().getOwner().getMojangId() != null;
    }

    public UUID getLinkedAccount() {
        return this.getProperty().getOwner().getMojangId();
    }

    public String getOwnerDisplayName() {
        return this.getProperty().getOwner().getDisplayName();
    }

    public String getPrice() {
        return price;
    }
}
