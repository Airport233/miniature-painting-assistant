package com.minipaint.controller;

import com.minipaint.dto.ModelResponse;
import com.minipaint.service.ModelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/models")
public class ModelController {

    private final ModelService modelService;

    public ModelController(ModelService modelService) {
        this.modelService = modelService;
    }

    @GetMapping
    public ResponseEntity<List<ModelResponse>> list(Authentication auth) {
        return ResponseEntity.ok(modelService.listByUser((Long) auth.getPrincipal()));
    }

    @PostMapping
    public ResponseEntity<ModelResponse> upload(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        if (file.getSize() > 50 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 50MB limit");
        }
        ModelResponse response = modelService.upload((Long) auth.getPrincipal(), file.getBytes(), file.getOriginalFilename());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        modelService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
