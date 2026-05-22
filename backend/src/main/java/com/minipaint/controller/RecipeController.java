package com.minipaint.controller;

import com.minipaint.dto.RecipeRequest;
import com.minipaint.dto.RecipeResponse;
import com.minipaint.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> list(Authentication auth) {
        return ResponseEntity.ok(recipeService.listByUser((Long) auth.getPrincipal()));
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> create(@Valid @RequestBody RecipeRequest req, Authentication auth) {
        return ResponseEntity.ok(recipeService.create((Long) auth.getPrincipal(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        recipeService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
