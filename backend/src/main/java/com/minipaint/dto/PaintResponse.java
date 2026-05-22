package com.minipaint.dto;

import java.time.Instant;

public class PaintResponse {
    private Long id;
    private String brand, brandOther, colorName, colorCode, imageUrl, notes;
    private int r, g, b;
    private Instant createdAt;

    public PaintResponse() {}

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
