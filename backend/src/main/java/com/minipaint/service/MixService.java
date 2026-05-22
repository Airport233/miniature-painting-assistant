package com.minipaint.service;

import com.minipaint.dto.*;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MixService {
    private final PaintRepository paintRepo;

    public MixService(PaintRepository paintRepo) {
        this.paintRepo = paintRepo;
    }

    public MixResponse mix(Long userId, int targetR, int targetG, int targetB) {
        List<Paint> paints = paintRepo.findByUserIdAndIsDeletedFalse(userId);
        MixResponse.Tricolor tricolor = computeTricolor(targetR, targetG, targetB);
        List<MixCandidate> candidates = new ArrayList<>();
        if (paints.size() >= 2) {
            candidates = computeCandidates(targetR, targetG, targetB, paints);
        }
        return new MixResponse(tricolor, candidates);
    }

    private MixResponse.Tricolor computeTricolor(int tr, int tg, int tb) {
        double c = 1.0 - (tr / 255.0);
        double m = 1.0 - (tg / 255.0);
        double y = 1.0 - (tb / 255.0);
        double w = Math.min(Math.min(c, m), y);
        double denom = 1 - w + 0.001; // avoid division by zero
        c = (c - w) / denom;
        m = (m - w) / denom;
        y = (y - w) / denom;
        return new MixResponse.Tricolor(
            Math.round(c * 100.0) / 100.0,
            Math.round(m * 100.0) / 100.0,
            Math.round(y * 100.0) / 100.0,
            Math.round(w * 100.0) / 100.0
        );
    }

    private List<MixCandidate> computeCandidates(int tr, int tg, int tb, List<Paint> paints) {
        List<MixCandidate> results = new ArrayList<>();
        int n = paints.size();
        int[] parts = {1, 2, 3, 4};

        // 2-paint mixes
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int a : parts) {
                    for (int b : parts) {
                        if (a + b > 5) continue;
                        double total = a + b;
                        double da = a / total, db = b / total;
                        int mr = clamp(da * paints.get(i).getR() + db * paints.get(j).getR());
                        int mg = clamp(da * paints.get(i).getG() + db * paints.get(j).getG());
                        int mb = clamp(da * paints.get(i).getB() + db * paints.get(j).getB());
                        double de = deltaE(tr, tg, tb, mr, mg, mb);
                        results.add(buildCandidate(
                            new int[][]{{i, a}, {j, b}}, mr, mg, mb, de, paints));
                    }
                }
            }
        }

        // 3-paint mixes
        if (n >= 3) {
            int[][] triples = {{1,1,1},{1,1,2},{1,2,2},{1,1,3}};
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    for (int k = j + 1; k < n; k++) {
                        for (int[] t : triples) {
                            double sum = t[0] + t[1] + t[2];
                            int mr = clamp((t[0]*paints.get(i).getR()+t[1]*paints.get(j).getR()+t[2]*paints.get(k).getR())/sum);
                            int mg = clamp((t[0]*paints.get(i).getG()+t[1]*paints.get(j).getG()+t[2]*paints.get(k).getG())/sum);
                            int mb = clamp((t[0]*paints.get(i).getB()+t[1]*paints.get(j).getB()+t[2]*paints.get(k).getB())/sum);
                            double de = deltaE(tr, tg, tb, mr, mg, mb);
                            results.add(buildCandidate(
                                new int[][]{{i,t[0]},{j,t[1]},{k,t[2]}}, mr, mg, mb, de, paints));
                        }
                    }
                }
            }
        }

        results.sort(Comparator.comparingDouble(MixCandidate::getDeltaE));
        return results.stream().limit(10).collect(Collectors.toList());
    }

    private MixCandidate buildCandidate(int[][] parts, int mr, int mg, int mb, double de, List<Paint> paints) {
        int total = 0;
        for (int[] p : parts) total += p[1];
        List<MixCandidate.Component> comps = new ArrayList<>();
        for (int[] p : parts) {
            Paint paint = paints.get(p[0]);
            boolean trace = ((double) p[1] / total) <= 0.1;
            comps.add(new MixCandidate.Component(paint.getId(), paint.getColorName(), p[1], trace));
        }
        String hex = String.format("#%02X%02X%02X", mr, mg, mb);
        return new MixCandidate(comps, mr, mg, mb, Math.round(de*100.0)/100.0, hex);
    }

    private double deltaE(int r1, int g1, int b1, int r2, int g2, int b2) {
        return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    }

    private int clamp(double v) {
        return (int) Math.min(255, Math.max(0, Math.round(v)));
    }
}
