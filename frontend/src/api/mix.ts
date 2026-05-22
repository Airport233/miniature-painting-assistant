import client from './client';
import type { MixRequest, MixResponse } from '../types';

export const mix = async (data: MixRequest): Promise<MixResponse> => {
  const response = await client.post<MixResponse>('/mix', data);
  return response.data;
};
