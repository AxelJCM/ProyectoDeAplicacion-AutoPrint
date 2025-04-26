import api from './api';

// Iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data && response.data.token) {
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error de login:', error);
    throw error;
  }
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verificar si hay una sesión activa
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Obtener usuario actual
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

// Verificar validez del token
export const validateToken = async () => {
  try {
    await api.get('/auth/validate');
    return true;
  } catch (error) {
    console.error('Token inválido:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// Actualizar contraseña del usuario
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/update-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw error;
  }
};