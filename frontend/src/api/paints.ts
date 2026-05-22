import client from './client';
import type { PaintResponse, PaintRequest } from '../types';

export const list = async (): Promise<PaintResponse[]> => {
  const response = await client.get<PaintResponse[]>('/paints');
  return response.data;
};

export const get = async (id: number): Promise<PaintResponse> => {
  const response = await client.get<PaintResponse>(`/paints/${id}`);
  return response.data;
};

export const create = async (data: PaintRequest): Promise<PaintResponse> => {
  const response = await client.post<PaintResponse>('/paints', data);
  return response.data;
};

export const update = async (id: number, data: PaintRequest): Promise<PaintResponse> => {
  const response = await client.put<PaintResponse>(`/paints/${id}`, data);
  return response.data;
};

export const remove = async (id: number): Promise<void> => {
  await client.delete(`/paints/${id}`);
};
