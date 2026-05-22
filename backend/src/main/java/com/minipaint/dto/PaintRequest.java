package com.minipaint.dto;

import jakarta.validation.constraints.*;

public class PaintRequest {
    @NotBlank private String brand;
    private String brandOther;
    @NotBlank @Size(max = 100) private String colorName;
    @Size(max = 30) private String colorCode;
    @Min(0) @Max(255) private int r;
    @Min(0) @Max(255) private int g;
    @Min(0) @Max(255) private int b;
    @Size(max = 500) private String notes;

    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
}
