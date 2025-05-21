import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Campaign endpoints
export const getCampaigns = () => api.get('/campaigns');
export const getMyCampaigns = () => api.get('/campaigns/my-campaigns');
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);
export const submitReport = (id, content) => api.post(`/campaigns/${id}/reports`, { content });

// User endpoints
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const assignUserToCampaign = (userId, campaignId) => 
  api.post(`/users/${userId}/assign-campaign`, { campaignId });

// Auth endpoints
export const registerUser = (data) => api.post('/auth/register', data);
export const updateUserRole = (userId, role) => api.put(`/auth/role/${userId}`, { role });
export const getCurrentUser = () => api.get('/auth/me');

export default api; 