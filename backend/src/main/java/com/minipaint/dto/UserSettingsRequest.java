package com.minipaint.dto;

public class UserSettingsRequest {
    private double defaultRoughness;
    private double defaultMetalness;
    private int defaultLightCount;
    private double defaultLightPosX;
    private double defaultLightPosY;
    private double defaultLightPosZ;

    public double getDefaultRoughness() { return defaultRoughness; }
    public void setDefaultRoughness(double defaultRoughness) { this.defaultRoughness = defaultRoughness; }
    public double getDefaultMetalness() { return defaultMetalness; }
    public void setDefaultMetalness(double defaultMetalness) { this.defaultMetalness = defaultMetalness; }
    public int getDefaultLightCount() { return defaultLightCount; }
    public void setDefaultLightCount(int defaultLightCount) { this.defaultLightCount = defaultLightCount; }
    public double getDefaultLightPosX() { return defaultLightPosX; }
    public void setDefaultLightPosX(double defaultLightPosX) { this.defaultLightPosX = defaultLightPosX; }
    public double getDefaultLightPosY() { return defaultLightPosY; }
    public void setDefaultLightPosY(double defaultLightPosY) { this.defaultLightPosY = defaultLightPosY; }
    public double getDefaultLightPosZ() { return defaultLightPosZ; }
    public void setDefaultLightPosZ(double defaultLightPosZ) { this.defaultLightPosZ = defaultLightPosZ; }
}
