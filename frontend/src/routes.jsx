import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';

// Componentes de páginas
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PrinterDetails from './components/monitoring/PrinterDetails';
import Layout from './components/common/Layout';
import NotFound from './components/common/NotFound';
import Settings from './components/settings/Settings';
import Help from './components/help/Help';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta raíz - redirecciona a dashboard si autenticado, o a login si no */}
        <Route path="/" element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="printer/:printerId" element={<PrinterDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
        
        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;