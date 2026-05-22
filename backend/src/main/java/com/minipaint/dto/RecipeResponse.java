package com.minipaint.dto;

import java.time.Instant;
import java.util.List;

public class RecipeResponse {
    private Long id;
    private String name;
    private String description;
    private Integer targetR;
    private Integer targetG;
    private Integer targetB;
    private String targetImageUrl;
    private Instant createdAt;
    private List<ComponentItem> components;

    public static class ComponentItem {
        private Long paintId;
        private String paintName;
        private int ratio;

        public Long getPaintId() { return paintId; } public void setPaintId(Long paintId) { this.paintId = paintId; }
        public String getPaintName() { return paintName; } public void setPaintName(String paintName) { this.paintName = paintName; }
        public int getRatio() { return ratio; } public void setRatio(int ratio) { this.ratio = ratio; }
    }

    public RecipeResponse() {}

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public Integer getTargetR() { return targetR; } public void setTargetR(Integer targetR) { this.targetR = targetR; }
    public Integer getTargetG() { return targetG; } public void setTargetG(Integer targetG) { this.targetG = targetG; }
    public Integer getTargetB() { return targetB; } public void setTargetB(Integer targetB) { this.targetB = targetB; }
    public String getTargetImageUrl() { return targetImageUrl; } public void setTargetImageUrl(String targetImageUrl) { this.targetImageUrl = targetImageUrl; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<ComponentItem> getComponents() { return components; } public void setComponents(List<ComponentItem> components) { this.components = components; }
}
