package com.minipaint.service;

import com.minipaint.dto.RecipeRequest;
import com.minipaint.dto.RecipeResponse;
import com.minipaint.dto.RecipeResponse.ComponentItem;
import com.minipaint.model.Paint;
import com.minipaint.model.Recipe;
import com.minipaint.model.RecipeComponent;
import com.minipaint.repository.PaintRepository;
import com.minipaint.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepo;
    private final PaintRepository paintRepo;

    public RecipeService(RecipeRepository recipeRepo, PaintRepository paintRepo) {
        this.recipeRepo = recipeRepo;
        this.paintRepo = paintRepo;
    }

    @Transactional
    public RecipeResponse create(Long userId, RecipeRequest req) {
        Recipe r = new Recipe();
        r.setUserId(userId);
        r.setName(req.getName());
        r.setDescription(req.getDescription());
        r.setTargetR(req.getTargetR());
        r.setTargetG(req.getTargetG());
        r.setTargetB(req.getTargetB());
        recipeRepo.save(r);

        if (req.getComponents() != null) {
            for (Map<String, Object> comp : req.getComponents()) {
                Long paintId = ((Number) comp.get("paintId")).longValue();
                int ratio = ((Number) comp.get("ratio")).intValue();
                Paint paint = paintRepo.findById(paintId)
                        .orElseThrow(() -> new RuntimeException("Paint not found"));
                RecipeComponent rc = new RecipeComponent();
                rc.setRecipe(r);
                rc.setPaint(paint);
                rc.setRatio(ratio);
                r.getComponents().add(rc);
            }
        }
        recipeRepo.save(r);
        return toResponse(r);
    }

    public List<RecipeResponse> listByUser(Long userId) {
        return recipeRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        recipeRepo.deleteById(id);
    }

    private RecipeResponse toResponse(Recipe r) {
        RecipeResponse resp = new RecipeResponse();
        resp.setId(r.getId());
        resp.setName(r.getName());
        resp.setDescription(r.getDescription());
        resp.setTargetR(r.getTargetR());
        resp.setTargetG(r.getTargetG());
        resp.setTargetB(r.getTargetB());
        resp.setTargetImageUrl(r.getTargetImageUrl());
        resp.setCreatedAt(r.getCreatedAt());
        resp.setComponents(r.getComponents().stream().map(rc -> {
            ComponentItem item = new ComponentItem();
            item.setPaintId(rc.getPaint().getId());
            item.setPaintName(rc.getPaint().getColorName());
            item.setRatio(rc.getRatio());
            return item;
        }).collect(Collectors.toList()));
        return resp;
    }
}
