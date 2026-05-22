package com.minipaint.dto;

import java.util.List;

public class MixCandidate {
    private List<Component> components;
    private int mixedR, mixedG, mixedB;
    private double deltaE;
    private String previewHex;

    public static class Component {
        private Long paintId;
        private String paintName;
        private int ratio;
        private boolean traceAmount;

        public Component() {}

        public Component(Long id, String name, int ratio, boolean trace) {
            this.paintId = id;
            this.paintName = name;
            this.ratio = ratio;
            this.traceAmount = trace;
        }

        public Long getPaintId() { return paintId; }
        public void setPaintId(Long id) { this.paintId = id; }
        public String getPaintName() { return paintName; }
        public void setPaintName(String n) { this.paintName = n; }
        public int getRatio() { return ratio; }
        public void setRatio(int r) { this.ratio = r; }
        public boolean isTraceAmount() { return traceAmount; }
        public void setTraceAmount(boolean t) { this.traceAmount = t; }
    }

    public MixCandidate() {}

    public MixCandidate(List<Component> comps, int mr, int mg, int mb, double de, String hex) {
        this.components = comps;
        this.mixedR = mr;
        this.mixedG = mg;
        this.mixedB = mb;
        this.deltaE = de;
        this.previewHex = hex;
    }

    public List<Component> getComponents() { return components; }
    public void setComponents(List<Component> c) { this.components = c; }
    public int getMixedR() { return mixedR; }
    public void setMixedR(int r) { this.mixedR = r; }
    public int getMixedG() { return mixedG; }
    public void setMixedG(int g) { this.mixedG = g; }
    public int getMixedB() { return mixedB; }
    public void setMixedB(int b) { this.mixedB = b; }
    public double getDeltaE() { return deltaE; }
    public void setDeltaE(double d) { this.deltaE = d; }
    public String getPreviewHex() { return previewHex; }
    public void setPreviewHex(String h) { this.previewHex = h; }
}
