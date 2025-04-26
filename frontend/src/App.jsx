import React from 'react';
import AppRoutes from './routes';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
