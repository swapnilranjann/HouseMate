import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor for Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('house_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth APIs ---
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const updateProfile = (data) => api.put('/auth/update-profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);

// --- Property APIs ---
export const getProperties = () => api.get('/properties');
export const getPropertyById = async (id) => {
    const { data } = await api.get('/properties');
    return data.find(p => p._id === id);
};
export const createProperty = (data) => api.post('/properties', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePropertyStatus = (id, status) => api.put(`/properties/${id}/status`, { status });
export const incrementPropertyView = (id) => api.post(`/properties/${id}/view`);
export const favoriteProperty = (id) => api.post(`/properties/${id}/favorite`);

// --- Appointment APIs ---
export const requestAppointment = (propertyId) => api.post('/appointments', { propertyId });
export const getMyAppointments = () => api.get('/appointments/my');
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}`, { status });

// --- Chat APIs ---
export const getChats = () => api.get('/chats');
export const getChatDetails = (id) => api.get(`/chats/${id}`);
export const sendChatMessage = (id, text) => api.post(`/chats/${id}/messages`, { text });

// --- Support APIs ---
export const createSupportTicket = (data) => api.post('/support', data);
export const getMyTickets = () => api.get('/support/my-tickets');

export default api;
