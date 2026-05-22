import client from './client';

export interface ModelUploadResponse {
  id: number;
  filename: string;
  filePath: string;
}

export const upload = async (file: File): Promise<ModelUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post<ModelUploadResponse>('/models', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const remove = async (id: number): Promise<void> => {
  await client.delete(`/models/${id}`);
};
