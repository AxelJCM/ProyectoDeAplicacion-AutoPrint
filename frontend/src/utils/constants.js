// API y servicios
export const API_BASE_URL = 'http://localhost:5000/api';
export const MQTT_BROKER_URL = 'ws://localhost:9001'; // Puerto WebSocket para MQTT

// Intervalo de actualización (en milisegundos)
export const SENSOR_DATA_UPDATE_INTERVAL = 5000;
export const PRINTERS_LIST_UPDATE_INTERVAL = 30000;
export const ALERTS_UPDATE_INTERVAL = 10000;

// Límites para alertas
export const TEMPERATURE_LIMITS = {
  MIN_SAFE: 15,
  MAX_SAFE: 30,
  WARNING: 35,
  CRITICAL: 40
};

export const HUMIDITY_LIMITS = {
  MIN_SAFE: 30,
  MAX_SAFE: 60,
  WARNING: 70,
  CRITICAL: 80
};

// Estados de impresora
export const PRINTER_STATUSES = {
  ACTIVE: 'active',
  IDLE: 'idle',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline'
};

// Colores para gráficos
export const CHART_COLORS = {
  TEMPERATURE: {
    LINE: 'rgba(255, 99, 132, 1)',
    FILL: 'rgba(255, 99, 132, 0.2)',
  },
  HUMIDITY: {
    LINE: 'rgba(54, 162, 235, 1)',
    FILL: 'rgba(54, 162, 235, 0.2)',
  }
};

// Niveles de riesgo
export const RISK_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRINTER_DETAILS: '/printer/:printerId',
  SETTINGS: '/settings',
  HELP: '/help'
};