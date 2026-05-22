package com.minipaint.controller;

import com.minipaint.dto.*;
import com.minipaint.service.MixService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mix")
public class MixController {
    private final MixService service;

    public MixController(MixService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MixResponse> mix(@Valid @RequestBody MixRequest req, Authentication auth) {
        return ResponseEntity.ok(
            service.mix((Long) auth.getPrincipal(), req.getTargetR(), req.getTargetG(), req.getTargetB()));
    }
}
