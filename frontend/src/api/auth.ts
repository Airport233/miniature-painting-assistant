import client from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await client.post('/auth/register', data);
};

export const verifyEmail = async (token: string): Promise<void> => {
  await client.post('/auth/verify-email', { token });
};

export const forgotPassword = async (email: string): Promise<void> => {
  await client.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await client.post('/auth/reset-password', { token, newPassword });
};
