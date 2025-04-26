import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configurar axios con headers por defecto
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Obtener lista de impresoras conectadas
export const fetchConnectedPrinters = async () => {
  try {
    const response = await api.get('/printers');
    return response.data;
  } catch (error) {
    console.error('Error fetching printers:', error);
    throw error;
  }
};

// Obtener detalles de una impresora específica
export const fetchPrinterDetails = async (printerId) => {
  try {
    const response = await api.get(`/printers/${printerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching printer details:', error);
    throw error;
  }
};

// Obtener datos de sensores para una impresora
export const fetchSensorData = async (printerId) => {
  try {
    const response = await api.get(`/printers/${printerId}/sensors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
};

// Obtener alertas para una impresora
export const fetchAlerts = async (printerId) => {
  try {
    const response = await api.get(`/printers/${printerId}/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

// Obtener historial de eventos para una impresora
export const fetchPrinterHistory = async (printerId, filters = {}) => {
  try {
    const response = await api.get(`/printers/${printerId}/history`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching printer history:', error);
    throw error;
  }
};

// Exportar datos de una impresora
export const exportPrinterData = async (printerId, format, dateRange) => {
  try {
    const response = await api.get(`/printers/${printerId}/export`, {
      params: { format, ...dateRange },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting printer data:', error);
    throw error;
  }
};

export default api;