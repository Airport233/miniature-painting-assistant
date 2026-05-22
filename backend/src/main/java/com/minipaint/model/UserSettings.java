package com.minipaint.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private double defaultRoughness = 0.5;
    private double defaultMetalness = 0.0;

    @Column(name = "default_light_count")
    private int defaultLightCount = 1;

    @Column(name = "default_light_pos_x")
    private double defaultLightPosX = 0.0;

    @Column(name = "default_light_pos_y")
    private double defaultLightPosY = 5.0;

    @Column(name = "default_light_pos_z")
    private double defaultLightPosZ = 5.0;

    public UserSettings() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long id) { this.userId = id; }
    public double getDefaultRoughness() { return defaultRoughness; }
    public void setDefaultRoughness(double v) { this.defaultRoughness = v; }
    public double getDefaultMetalness() { return defaultMetalness; }
    public void setDefaultMetalness(double v) { this.defaultMetalness = v; }
    public int getDefaultLightCount() { return defaultLightCount; }
    public void setDefaultLightCount(int v) { this.defaultLightCount = v; }
    public double getDefaultLightPosX() { return defaultLightPosX; }
    public void setDefaultLightPosX(double v) { this.defaultLightPosX = v; }
    public double getDefaultLightPosY() { return defaultLightPosY; }
    public void setDefaultLightPosY(double v) { this.defaultLightPosY = v; }
    public double getDefaultLightPosZ() { return defaultLightPosZ; }
    public void setDefaultLightPosZ(double v) { this.defaultLightPosZ = v; }
}
