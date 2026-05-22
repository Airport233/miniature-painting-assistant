import { create } from 'zustand';
import * as recipesApi from '../api/recipes';
import type { RecipeResponse, RecipeRequest } from '../types';

interface RecipeState {
  recipes: RecipeResponse[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  save: (data: RecipeRequest) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const recipes = await recipesApi.list();
      set({ recipes, loading: false });
    } catch {
      set({ loading: false, error: 'Failed to load recipes' });
    }
  },
  save: async (data: RecipeRequest) => {
    set({ loading: true, error: null });
    try {
      const recipe = await recipesApi.create(data);
      set((state) => ({ recipes: [...state.recipes, recipe], loading: false }));
    } catch {
      set({ loading: false, error: 'Failed to save recipe' });
    }
  },
  remove: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await recipesApi.remove(id);
      set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id),
        loading: false,
      }));
    } catch {
      set({ loading: false, error: 'Failed to delete recipe' });
    }
  },
}));
