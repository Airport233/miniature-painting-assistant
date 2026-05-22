import { create } from 'zustand';
import * as paintsApi from '../api/paints';
import type { PaintResponse, PaintRequest } from '../types';

interface PaintState {
  paints: PaintResponse[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  create: (data: PaintRequest) => Promise<void>;
  update: (id: number, data: PaintRequest) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const usePaintStore = create<PaintState>((set) => ({
  paints: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const paints = await paintsApi.list();
      set({ paints, loading: false });
    } catch {
      set({ loading: false, error: 'Failed to load paints' });
    }
  },
  create: async (data: PaintRequest) => {
    set({ loading: true, error: null });
    try {
      const paint = await paintsApi.create(data);
      set((state) => ({ paints: [...state.paints, paint], loading: false }));
    } catch {
      set({ loading: false, error: 'Failed to create paint' });
    }
  },
  update: async (id: number, data: PaintRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await paintsApi.update(id, data);
      set((state) => ({
        paints: state.paints.map((p) => (p.id === id ? updated : p)),
        loading: false,
      }));
    } catch {
      set({ loading: false, error: 'Failed to update paint' });
    }
  },
  remove: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await paintsApi.remove(id);
      set((state) => ({
        paints: state.paints.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch {
      set({ loading: false, error: 'Failed to delete paint' });
    }
  },
}));
