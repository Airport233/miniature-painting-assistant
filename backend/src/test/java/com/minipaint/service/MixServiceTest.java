package com.minipaint.service;

import com.minipaint.dto.*;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class MixServiceTest {
    @Autowired private MixService mixService;
    @Autowired private PaintRepository paintRepository;

    private void addPaint(Long userId, String name, int r, int g, int b) {
        Paint p = new Paint(); p.setUserId(userId); p.setBrand("GW");
        p.setColorName(name); p.setR(r); p.setG(g); p.setB(b);
        paintRepository.save(p);
    }

    @Test
    void shouldReturnTricolorAndCandidates() {
        addPaint(1L, "Red", 200, 30, 30);
        addPaint(1L, "Blue", 30, 30, 200);
        addPaint(1L, "White", 255, 255, 255);

        MixResponse resp = mixService.mix(1L, 120, 130, 130);
        assertThat(resp.getTricolor()).isNotNull();
        assertThat(resp.getCandidates()).isNotEmpty();
        MixCandidate first = resp.getCandidates().get(0);
        assertThat(first.getDeltaE()).isGreaterThanOrEqualTo(0);
        assertThat(first.getPreviewHex()).startsWith("#");
    }

    @Test
    void shouldReturnOnlyTricolorWhenNoPaints() {
        MixResponse resp = mixService.mix(999L, 120, 130, 130);
        assertThat(resp.getTricolor()).isNotNull();
        assertThat(resp.getCandidates()).isEmpty();
    }

    @Test
    void shouldReturnOnlyTricolorWhenOnePaint() {
        addPaint(2L, "Single", 100, 100, 100);
        MixResponse resp = mixService.mix(2L, 120, 130, 130);
        assertThat(resp.getTricolor()).isNotNull();
        assertThat(resp.getCandidates()).isEmpty();
    }

    @Test
    void candidatesShouldBeSortedByDeltaE() {
        addPaint(1L, "A", 255, 0, 0);
        addPaint(1L, "B", 0, 0, 255);
        addPaint(1L, "C", 0, 255, 0);

        MixResponse resp = mixService.mix(1L, 100, 100, 200);
        List<MixCandidate> candidates = resp.getCandidates();
        for (int i = 1; i < candidates.size(); i++) {
            assertThat(candidates.get(i).getDeltaE())
                .isGreaterThanOrEqualTo(candidates.get(i - 1).getDeltaE());
        }
    }
}
