package com.minipaint.service;

import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class PaintServiceTest {
    @Autowired private PaintService paintService;

    @Test
    void shouldCreateAndListPaints() {
        PaintRequest req = new PaintRequest();
        req.setBrand("GW"); req.setColorName("Russ Grey"); req.setColorCode("991899");
        req.setR(135); req.setG(156); req.setB(158);
        paintService.create(1L, req);

        List<PaintResponse> paints = paintService.listByUser(1L);
        assertThat(paints).hasSize(1);
        assertThat(paints.get(0).getColorName()).isEqualTo("Russ Grey");
        assertThat(paints.get(0).getBrand()).isEqualTo("GW");
    }

    @Test
    void shouldUpdateAndDeletePaints() {
        PaintRequest req = new PaintRequest();
        req.setBrand("AV"); req.setColorName("Ice Yellow"); req.setR(255); req.setG(240); req.setB(180);
        PaintResponse created = paintService.create(1L, req);

        PaintRequest update = new PaintRequest();
        update.setBrand("AK"); update.setColorName("Ice Yellow V2"); update.setR(250); update.setG(235); update.setB(175);
        PaintResponse updated = paintService.update(created.getId(), update);
        assertThat(updated.getBrand()).isEqualTo("AK");

        paintService.delete(created.getId());
        List<PaintResponse> list = paintService.listByUser(1L);
        assertThat(list).isEmpty();
    }

    @Test
    void shouldFilterByBrand() {
        PaintRequest gw = new PaintRequest();
        gw.setBrand("GW"); gw.setColorName("A"); gw.setR(100); gw.setG(100); gw.setB(100);
        paintService.create(1L, gw);

        PaintRequest av = new PaintRequest();
        av.setBrand("AV"); av.setColorName("B"); av.setR(200); av.setG(200); av.setB(200);
        paintService.create(1L, av);

        List<PaintResponse> list = paintService.listByUser(1L);
        assertThat(list).hasSize(2);
    }
}
