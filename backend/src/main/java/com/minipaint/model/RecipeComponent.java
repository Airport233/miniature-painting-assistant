package com.minipaint.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recipe_components")
public class RecipeComponent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paint_id", nullable = false)
    private Paint paint;

    @Column(nullable = false)
    private int ratio;

    @Column(name = "is_tricolor", nullable = false)
    private boolean isTricolor = false;

    public RecipeComponent() {}

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Recipe getRecipe() { return recipe; } public void setRecipe(Recipe recipe) { this.recipe = recipe; }
    public Paint getPaint() { return paint; } public void setPaint(Paint paint) { this.paint = paint; }
    public int getRatio() { return ratio; } public void setRatio(int ratio) { this.ratio = ratio; }
    public boolean isTricolor() { return isTricolor; } public void setTricolor(boolean tricolor) { isTricolor = tricolor; }
}
