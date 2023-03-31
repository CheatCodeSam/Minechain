package com.minechain.minechain.types;

import java.util.UUID;

public class UserDto {
    private Integer id;
    private Boolean isActive;
    private String publicAddress;
    private UUID mojangId;
    private String displayName;

    public UserDto(Integer id, Boolean isActive, String publicAddress, UUID mojangId, String displayName) {
        this.id = id;
        this.isActive = isActive;
        this.publicAddress = publicAddress;
        this.mojangId = mojangId;
        this.displayName = displayName;
    }

    public Integer getId() {
        return id;
    }
    public Boolean getIsActive() {
        return isActive;
    }
    public String getPublicAddress() {
        return publicAddress;
    }
    public UUID getMojangId() {
        return mojangId;
    }
    public String getDisplayName() {
        return displayName;
    }
}
