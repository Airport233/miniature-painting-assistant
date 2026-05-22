package com.minipaint.repository;

import com.minipaint.model.RecipeComponent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeComponentRepository extends JpaRepository<RecipeComponent, Long> {
}
