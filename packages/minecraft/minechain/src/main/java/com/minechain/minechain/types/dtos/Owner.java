package com.minechain.minechain.types.dtos;

import com.google.gson.annotations.SerializedName;

public class Owner {
    @SerializedName("id")
    private int id;

    @SerializedName("isActive")
    private boolean isActive;

    @SerializedName("publicAddress")
    private String publicAddress;

    @SerializedName("mojangId")
    private String mojangId;

    @SerializedName("lastKnownRegion")
    private String lastKnownRegion;

    @SerializedName("dateJoined")
    private String dateJoined;

    @SerializedName("lastLogin")
    private String lastLogin;

    @SerializedName("isSuperUser")
    private boolean isSuperUser;

    @SerializedName("ensName")
    private String ensName;

    @SerializedName("displayName")
    private String displayName;

    @SerializedName("profilePicture")
    private String profilePicture;

    public int getId() {
        return id;
    }

    public boolean isActive() {
        return isActive;
    }

    public String getPublicAddress() {
        return publicAddress;
    }

    public String getMojangId() {
        return mojangId;
    }

    public String getLastKnownRegion() {
        return lastKnownRegion;
    }

    public String getDateJoined() {
        return dateJoined;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public boolean isSuperUser() {
        return isSuperUser;
    }

    public String getEnsName() {
        return ensName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }
}