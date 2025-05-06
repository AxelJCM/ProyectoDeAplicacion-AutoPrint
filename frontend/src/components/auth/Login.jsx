import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Styling
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
    padding: '0 16px',
  },
  card: {
    maxWidth: '28rem',
    width: '100%',
    background: 'white',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logoCircle: {
    height: '48px',
    width: '48px',
    backgroundColor: '#2563eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logo: {
    height: '24px',
    width: '24px',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  demoBox: {
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '24px',
  },
  demoText: {
    fontSize: '12px',
    color: '#4b5563',
    textAlign: 'center',
  },
  demoCode: {
    fontFamily: 'monospace',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderLeft: '4px solid #ef4444',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
  },
  errorIcon: {
    height: '20px',
    width: '20px',
    color: '#f87171',
    flexShrink: 0,
  },
  errorMessage: {
    marginLeft: '12px',
    fontSize: '14px',
    color: '#b91c1c',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: '14px',
    color: '#2563eb',
    fontWeight: '500',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#2563eb',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '12px',
    color: '#9ca3af',
  }
};

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "admin@autoprint.com",
  password: "admin123"
};

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check against demo credentials
      if (credentials.email === DEMO_CREDENTIALS.email && 
          credentials.password === DEMO_CREDENTIALS.password) {
        
        localStorage.setItem('token', 'demo-jwt-token-123456789');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          name: 'Administrador',
          email: DEMO_CREDENTIALS.email,
          role: 'admin'
        }));
        
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas. Use admin@autoprint.com / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo and Title */}
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}>
            <svg style={styles.logo} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <h2 style={styles.title}>AutoPrint</h2>
          <p style={styles.subtitle}>Sistema de Monitoreo para Impresoras 3D</p>
        </div>
        
        {/* Demo credentials info */}
        <div style={styles.demoBox}>
          <p style={{...styles.demoText, fontWeight: 500, marginBottom: '4px'}}>Credenciales de prueba:</p>
          <p style={{...styles.demoText, ...styles.demoCode}}>Email: admin@autoprint.com</p>
          <p style={{...styles.demoText, ...styles.demoCode}}>Password: admin123</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>
            <svg style={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div style={styles.errorMessage}>{error}</div>
          </div>
        )}
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="example@autoprint.com"
            />
          </div>
          
          {/* Password input */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
          
          {/* Remember me & forgot password */}
          <div style={styles.flexBetween}>
            <div style={styles.checkbox}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label htmlFor="remember-me" style={{marginLeft: '8px', fontSize: '14px', color: '#374151'}}>
                Recordarme
              </label>
            </div>

            <button
              type="button"
              style={styles.forgotPassword}
              onClick={() => alert('Función no implementada')}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        
        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.copyright}>© 2025 AutoPrint Technology. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;