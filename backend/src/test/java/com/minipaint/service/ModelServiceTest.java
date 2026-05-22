package com.minipaint.service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest @ActiveProfiles("dev") @Transactional
class ModelServiceTest {
    @Autowired private ModelService modelService;

    @Test
    void shouldUploadAndListModels() {
        byte[] dummyStl = "solid test facet normal 0 0 0 outer loop vertex 0 0 0 endloop endfacet endsolid".getBytes();
        modelService.upload(1L, dummyStl, "test.stl");
        var models = modelService.listByUser(1L);
        assertThat(models).isNotEmpty();
    }

    @Test
    void shouldUploadAndDeleteModel() {
        byte[] dummyStl = "solid test facet normal 0 0 0 outer loop vertex 0 0 0 endloop endfacet endsolid".getBytes();
        modelService.upload(1L, dummyStl, "test2.stl");
        var models = modelService.listByUser(1L);
        assertThat(models).hasSize(1);
        modelService.delete(models.get(0).getId());
        assertThat(modelService.listByUser(1L)).isEmpty();
    }
}
