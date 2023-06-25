package com.minechain.minechain.types.dtos;

import java.util.List;

import com.google.gson.annotations.SerializedName;

public class PropertyList {

    @SerializedName("properties")
    private List<Property> properties;

    public List<Property> getProperties() {
        return properties;
    }

}
