package com.minipaint.repository;

import com.minipaint.model.SavedModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedModelRepository extends JpaRepository<SavedModel, Long> {
    List<SavedModel> findByUserIdOrderByUploadedAtDesc(Long userId);
}
