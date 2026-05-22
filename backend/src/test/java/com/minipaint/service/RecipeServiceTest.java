package com.minipaint.service;
import com.minipaint.dto.RecipeRequest;
import com.minipaint.dto.RecipeResponse;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest @ActiveProfiles("dev") @Transactional
class RecipeServiceTest {
    @Autowired private RecipeService recipeService;
    @Autowired private PaintRepository paintRepository;

    @Test
    void shouldSaveAndListRecipe() {
        Paint p = new Paint(); p.setUserId(1L); p.setBrand("GW");
        p.setColorName("Red"); p.setR(200); p.setG(30); p.setB(30);
        paintRepository.save(p);

        RecipeRequest req = new RecipeRequest();
        req.setName("Dark Red Armor");
        req.setTargetR(100); req.setTargetG(20); req.setTargetB(20);
        req.setComponents(List.of(Map.of("paintId", p.getId(), "ratio", 2)));

        RecipeResponse saved = recipeService.create(1L, req);
        assertThat(saved.getName()).isEqualTo("Dark Red Armor");
        assertThat(recipeService.listByUser(1L)).hasSize(1);
    }

    @Test
    void shouldDeleteRecipe() {
        Paint p = new Paint(); p.setUserId(1L); p.setBrand("GW");
        p.setColorName("Blue"); p.setR(30); p.setG(30); p.setB(200);
        paintRepository.save(p);

        RecipeRequest req = new RecipeRequest();
        req.setName("ToDelete"); req.setTargetR(50); req.setTargetG(50); req.setTargetB(100);
        req.setComponents(List.of(Map.of("paintId", p.getId(), "ratio", 1)));
        RecipeResponse created = recipeService.create(1L, req);

        recipeService.delete(created.getId());
        assertThat(recipeService.listByUser(1L)).isEmpty();
    }
}
