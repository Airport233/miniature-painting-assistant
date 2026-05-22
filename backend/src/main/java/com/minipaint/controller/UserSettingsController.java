package com.minipaint.controller;

import com.minipaint.dto.UserSettingsRequest;
import com.minipaint.dto.UserSettingsResponse;
import com.minipaint.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    public UserSettingsController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    @GetMapping
    public ResponseEntity<UserSettingsResponse> get(Authentication auth) {
        return ResponseEntity.ok(userSettingsService.getOrCreate((Long) auth.getPrincipal()));
    }

    @PutMapping
    public ResponseEntity<UserSettingsResponse> update(@RequestBody UserSettingsRequest req, Authentication auth) {
        return ResponseEntity.ok(userSettingsService.update((Long) auth.getPrincipal(), req));
    }
}
