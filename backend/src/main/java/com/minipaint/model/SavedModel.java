package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "saved_models")
public class SavedModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt = Instant.now();

    public SavedModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFilename() { return filename; }
    public void setFilename(String f) { this.filename = f; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String p) { this.filePath = p; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant t) { this.uploadedAt = t; }
}
