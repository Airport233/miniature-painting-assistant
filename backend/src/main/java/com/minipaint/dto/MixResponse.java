package com.minipaint.dto;

import java.util.List;

public class MixResponse {
    private Tricolor tricolor;
    private List<MixCandidate> candidates;

    public static class Tricolor {
        private double cyan, magenta, yellow, white;

        public Tricolor() {}

        public Tricolor(double c, double m, double y, double w) {
            this.cyan = c;
            this.magenta = m;
            this.yellow = y;
            this.white = w;
        }

        public double getCyan() { return cyan; }
        public void setCyan(double c) { this.cyan = c; }
        public double getMagenta() { return magenta; }
        public void setMagenta(double m) { this.magenta = m; }
        public double getYellow() { return yellow; }
        public void setYellow(double y) { this.yellow = y; }
        public double getWhite() { return white; }
        public void setWhite(double w) { this.white = w; }
    }

    public MixResponse() {}

    public MixResponse(Tricolor t, List<MixCandidate> c) {
        this.tricolor = t;
        this.candidates = c;
    }

    public Tricolor getTricolor() { return tricolor; }
    public void setTricolor(Tricolor t) { this.tricolor = t; }
    public List<MixCandidate> getCandidates() { return candidates; }
    public void setCandidates(List<MixCandidate> c) { this.candidates = c; }
}
