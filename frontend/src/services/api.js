import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour rafraîchir le token si expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_name');
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// TOUS LES SERVICES EXPORTÉS :

export const customerService = {
  getAll: () => api.get('/customers/'),
  getById: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.put(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
};

export const employeeService = {
  getAll: () => api.get('/employees/'),
  getById: (id) => api.get(`/employees/${id}/`),
};

export const salesOrderService = {
  getAll: () => api.get('/sales-orders/'),
  getById: (id) => api.get(`/sales-orders/${id}/`),
  create: (data) => api.post('/sales-orders/', data),
  update: (id, data) => api.put(`/sales-orders/${id}/`, data),
  delete: (id) => api.delete(`/sales-orders/${id}/`),
};

export const productService = {
  getAll: () => api.get('/products/'),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
};
// services/api.js - AJOUTE cet export
export const invoiceService = {
  getAll: () => api.get('/invoices/'),
  getById: (id) => api.get(`/invoices/${id}/`),
  create: (data) => api.post('/invoices/', data),
  update: (id, data) => api.put(`/invoices/${id}/`, data),
  delete: (id) => api.delete(`/invoices/${id}/`),
  markAsPaid: (id) => api.post(`/invoices/${id}/mark_paid/`),
  sendReminder: (id, data) => api.post(`/invoices/${id}/send_reminder/`, data),
};

// AJOUTE CE SERVICE POUR LES UTILISATEURS DJANGO
export const userService = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
};

export default api;