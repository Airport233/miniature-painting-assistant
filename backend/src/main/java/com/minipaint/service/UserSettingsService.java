package com.minipaint.service;

import com.minipaint.dto.UserSettingsRequest;
import com.minipaint.dto.UserSettingsResponse;
import com.minipaint.model.UserSettings;
import com.minipaint.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserSettingsService {

    private final UserSettingsRepository repo;

    public UserSettingsService(UserSettingsRepository repo) {
        this.repo = repo;
    }

    public UserSettingsResponse getOrCreate(Long userId) {
        UserSettings s = repo.findByUserId(userId);
        if (s == null) {
            s = new UserSettings();
            s.setUserId(userId);
            s = repo.save(s);
        }
        return toResponse(s);
    }

    @Transactional
    public UserSettingsResponse update(Long userId, UserSettingsRequest req) {
        UserSettings s = repo.findByUserId(userId);
        if (s == null) {
            s = new UserSettings();
            s.setUserId(userId);
        }
        s.setDefaultRoughness(req.getDefaultRoughness());
        s.setDefaultMetalness(req.getDefaultMetalness());
        s.setDefaultLightCount(req.getDefaultLightCount());
        s.setDefaultLightPosX(req.getDefaultLightPosX());
        s.setDefaultLightPosY(req.getDefaultLightPosY());
        s.setDefaultLightPosZ(req.getDefaultLightPosZ());
        return toResponse(repo.save(s));
    }

    private UserSettingsResponse toResponse(UserSettings s) {
        UserSettingsResponse r = new UserSettingsResponse();
        r.setId(s.getId());
        r.setUserId(s.getUserId());
        r.setDefaultRoughness(s.getDefaultRoughness());
        r.setDefaultMetalness(s.getDefaultMetalness());
        r.setDefaultLightCount(s.getDefaultLightCount());
        r.setDefaultLightPosX(s.getDefaultLightPosX());
        r.setDefaultLightPosY(s.getDefaultLightPosY());
        r.setDefaultLightPosZ(s.getDefaultLightPosZ());
        return r;
    }
}
