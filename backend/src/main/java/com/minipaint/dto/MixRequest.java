package com.minipaint.dto;

import jakarta.validation.constraints.*;

public class MixRequest {
    @Min(0) @Max(255) private int targetR;
    @Min(0) @Max(255) private int targetG;
    @Min(0) @Max(255) private int targetB;
    private int maxPaints = 3;

    public int getTargetR() { return targetR; }
    public void setTargetR(int r) { this.targetR = r; }
    public int getTargetG() { return targetG; }
    public void setTargetG(int g) { this.targetG = g; }
    public int getTargetB() { return targetB; }
    public void setTargetB(int b) { this.targetB = b; }
    public int getMaxPaints() { return maxPaints; }
    public void setMaxPaints(int m) { this.maxPaints = m; }
}
