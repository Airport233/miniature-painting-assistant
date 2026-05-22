package com.minipaint.dto;

public class UserSettingsResponse {
    private Long id;
    private Long userId;
    private double defaultRoughness;
    private double defaultMetalness;
    private int defaultLightCount;
    private double defaultLightPosX;
    private double defaultLightPosY;
    private double defaultLightPosZ;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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
