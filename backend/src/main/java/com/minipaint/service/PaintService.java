package com.minipaint.service;

import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaintService {
    private final PaintRepository repo;
    public PaintService(PaintRepository repo) { this.repo = repo; }

    @Transactional
    public PaintResponse create(Long userId, PaintRequest req) {
        Paint p = new Paint(); p.setUserId(userId);
        mapRequest(p, req);
        return toResponse(repo.save(p));
    }

    public List<PaintResponse> listByUser(Long userId) {
        return repo.findByUserIdAndIsDeletedFalse(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PaintResponse getById(Long id) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        return toResponse(p);
    }

    @Transactional
    public PaintResponse update(Long id, PaintRequest req) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        mapRequest(p, req);
        return toResponse(repo.save(p));
    }

    @Transactional
    public void delete(Long id) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        p.setDeleted(true);
        repo.save(p);
    }

    private void mapRequest(Paint p, PaintRequest req) {
        p.setBrand(req.getBrand()); p.setBrandOther(req.getBrandOther());
        p.setColorName(req.getColorName()); p.setColorCode(req.getColorCode());
        p.setR(req.getR()); p.setG(req.getG()); p.setB(req.getB());
        p.setNotes(req.getNotes());
    }

    private PaintResponse toResponse(Paint p) {
        PaintResponse r = new PaintResponse();
        r.setId(p.getId()); r.setBrand(p.getBrand()); r.setBrandOther(p.getBrandOther());
        r.setColorName(p.getColorName()); r.setColorCode(p.getColorCode());
        r.setR(p.getR()); r.setG(p.getG()); r.setB(p.getB());
        r.setImageUrl(p.getImageUrl()); r.setNotes(p.getNotes());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
