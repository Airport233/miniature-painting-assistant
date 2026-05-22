import client from './client';
import type { RecipeResponse, RecipeRequest } from '../types';

export const list = async (): Promise<RecipeResponse[]> => {
  const response = await client.get<RecipeResponse[]>('/recipes');
  return response.data;
};

export const create = async (data: RecipeRequest): Promise<RecipeResponse> => {
  const response = await client.post<RecipeResponse>('/recipes', data);
  return response.data;
};

export const remove = async (id: number): Promise<void> => {
  await client.delete(`/recipes/${id}`);
};
