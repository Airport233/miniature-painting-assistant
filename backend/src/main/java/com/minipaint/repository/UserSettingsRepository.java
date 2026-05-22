package com.minipaint.repository;

import com.minipaint.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    UserSettings findByUserId(Long userId);
}
