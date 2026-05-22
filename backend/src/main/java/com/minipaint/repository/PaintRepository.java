package com.minipaint.repository;

import com.minipaint.model.Paint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaintRepository extends JpaRepository<Paint, Long> {
    List<Paint> findByUserIdAndIsDeletedFalse(Long userId);
    List<Paint> findByUserIdAndBrandAndIsDeletedFalse(Long userId, String brand);
}
