package com.minipaint.controller;

import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import com.minipaint.service.PaintService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/paints")
public class PaintController {
    private final PaintService service;
    public PaintController(PaintService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<PaintResponse>> list(Authentication auth) {
        return ResponseEntity.ok(service.listByUser((Long) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaintResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PaintResponse> create(@Valid @RequestBody PaintRequest req, Authentication auth) {
        return ResponseEntity.ok(service.create((Long) auth.getPrincipal(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaintResponse> update(@PathVariable Long id, @Valid @RequestBody PaintRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
