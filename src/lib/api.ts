import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes API
export const notesApi = {
  getAll: () => api.get('/notes').then(res => res.data),
  getById: (id: string) => api.get(`/notes/${id}`).then(res => res.data),
  search: (query: string) => api.get(`/notes/search?q=${encodeURIComponent(query)}`).then(res => res.data),
  create: (data: any) => api.post('/notes', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// Folders API
export const foldersApi = {
  getAll: () => api.get('/folders').then(res => res.data),
  create: (data: any) => api.post('/folders', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/folders/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/folders/${id}`),
};

export default api;
