package com.minipaint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

public class RecipeRequest {
    @NotBlank @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    private Integer targetR;
    private Integer targetG;
    private Integer targetB;

    private List<Map<String, Object>> components;

    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public Integer getTargetR() { return targetR; } public void setTargetR(Integer targetR) { this.targetR = targetR; }
    public Integer getTargetG() { return targetG; } public void setTargetG(Integer targetG) { this.targetG = targetG; }
    public Integer getTargetB() { return targetB; } public void setTargetB(Integer targetB) { this.targetB = targetB; }
    public List<Map<String, Object>> getComponents() { return components; } public void setComponents(List<Map<String, Object>> components) { this.components = components; }
}
