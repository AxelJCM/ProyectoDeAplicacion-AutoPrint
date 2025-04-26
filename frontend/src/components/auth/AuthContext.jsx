import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getCurrentUser, validateToken } from '../../services/auth';

// Crear contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Verificar validez del token
          const isValid = await validateToken();
          if (isValid) {
            setUser(getCurrentUser());
          }
        }
      } catch (err) {
        setError('Error al verificar autenticación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Actualizar usuario en contexto
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Limpiar usuario (logout)
  const clearUser = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    updateUser,
    clearUser,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;