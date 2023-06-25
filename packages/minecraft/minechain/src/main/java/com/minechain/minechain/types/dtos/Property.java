package com.minechain.minechain.types.dtos;

import com.google.gson.annotations.SerializedName;

public class Property {
    @SerializedName("id")
    private int id;

    @SerializedName("ownerAddress")
    private String ownerAddress;

    @SerializedName("price")
    private String price;

    @SerializedName("deposit")
    private String deposit;

    @SerializedName("lastTaxPaidDate")
    private String lastTaxPaidDate;

    @SerializedName("lastPriceChangeDate")
    private String lastPriceChangeDate;

    @SerializedName("cumulativePrice")
    private String cumulativePrice;

    @SerializedName("priceChangeCount")
    private int priceChangeCount;

    @SerializedName("propertyRenderKey")
    private String propertyRenderKey;

    @SerializedName("owner")
    private Owner owner;

    @SerializedName("dueNow")
    private String dueNow;

    @SerializedName("dueNext")
    private String dueNext;

    public int getId() {
        return id;
    }

    public String getOwnerAddress() {
        return ownerAddress;
    }

    public String getPrice() {
        return price;
    }

    public String getDeposit() {
        return deposit;
    }

    public String getLastTaxPaidDate() {
        return lastTaxPaidDate;
    }

    public String getLastPriceChangeDate() {
        return lastPriceChangeDate;
    }

    public String getCumulativePrice() {
        return cumulativePrice;
    }

    public int getPriceChangeCount() {
        return priceChangeCount;
    }

    public String getPropertyRenderKey() {
        return propertyRenderKey;
    }

    public Owner getOwner() {
        return owner;
    }

    public String getDueNow() {
        return dueNow;
    }

    public String getDueNext() {
        return dueNext;
    }

}