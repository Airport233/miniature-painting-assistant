package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "target_r")
    private Integer targetR;

    @Column(name = "target_g")
    private Integer targetG;

    @Column(name = "target_b")
    private Integer targetB;

    @Column(name = "target_image_url", length = 500)
    private String targetImageUrl;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeComponent> components = new ArrayList<>();

    public Recipe() {}

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public Integer getTargetR() { return targetR; } public void setTargetR(Integer targetR) { this.targetR = targetR; }
    public Integer getTargetG() { return targetG; } public void setTargetG(Integer targetG) { this.targetG = targetG; }
    public Integer getTargetB() { return targetB; } public void setTargetB(Integer targetB) { this.targetB = targetB; }
    public String getTargetImageUrl() { return targetImageUrl; } public void setTargetImageUrl(String targetImageUrl) { this.targetImageUrl = targetImageUrl; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<RecipeComponent> getComponents() { return components; } public void setComponents(List<RecipeComponent> components) { this.components = components; }
}
