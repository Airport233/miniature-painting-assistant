package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "paints")
public class Paint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(name = "brand_other", length = 100)
    private String brandOther;

    @Column(name = "color_name", nullable = false, length = 100)
    private String colorName;

    @Column(name = "color_code", length = 30)
    private String colorCode;

    @Column(nullable = false) private int r;
    @Column(nullable = false) private int g;
    @Column(nullable = false) private int b;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 500) private String notes;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Paint() {}

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public boolean isDeleted() { return isDeleted; } public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
