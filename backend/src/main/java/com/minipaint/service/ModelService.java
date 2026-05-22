package com.minipaint.service;

import com.minipaint.dto.ModelResponse;
import com.minipaint.model.SavedModel;
import com.minipaint.repository.SavedModelRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModelService {

    private final SavedModelRepository repo;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public ModelService(SavedModelRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public ModelResponse upload(Long userId, byte[] bytes, String filename) {
        try {
            Path dir = Path.of(uploadDir, "models");
            Files.createDirectories(dir);
            String storedName = UUID.randomUUID() + "_" + filename;
            Path target = dir.resolve(storedName);
            Files.write(target, bytes);

            SavedModel m = new SavedModel();
            m.setUserId(userId);
            m.setFilename(filename);
            m.setFilePath("/uploads/models/" + storedName);
            return toResponse(repo.save(m));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload model", e);
        }
    }

    public List<ModelResponse> listByUser(Long userId) {
        return repo.findByUserIdOrderByUploadedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        SavedModel m = repo.findById(id).orElseThrow(() -> new RuntimeException("Model not found"));
        try {
            Files.deleteIfExists(Path.of(uploadDir).resolve("models").resolve(
                    m.getFilePath().substring(m.getFilePath().lastIndexOf('/') + 1)));
        } catch (IOException e) {
            // log but don't block deletion of the record
        }
        repo.delete(m);
    }

    private ModelResponse toResponse(SavedModel m) {
        ModelResponse r = new ModelResponse();
        r.setId(m.getId());
        r.setFilename(m.getFilename());
        r.setFilePath(m.getFilePath());
        r.setUploadedAt(m.getUploadedAt());
        return r;
    }
}
