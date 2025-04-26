import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/auth';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Determina si un enlace está activo
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path === '/settings' && location.pathname === '/settings') {
      return true;
    }
    if (path === '/help' && location.pathname === '/help') {
      return true;
    }
    if (path === '/printer' && location.pathname.startsWith('/printer')) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navegación superior */}
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">AutoPrint</span>
              </div>
              
              {/* Navegación para escritorio */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-500'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/settings') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-500'
                    }`}
                  >
                    Configuración
                  </Link>
                  <Link 
                    to="/help" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/help') 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-500'
                    }`}
                  >
                    Ayuda
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Menú de usuario */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Icono de notificaciones */}
                <button className="bg-blue-600 p-1 rounded-full text-white hover:bg-blue-500 focus:outline-none">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Perfil de usuario */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleDropdown}
                      className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none"
                    >
                      <span className="sr-only">Abrir menú de usuario</span>
                      <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                          {user?.name || 'Usuario'}
                          <div className="text-xs text-gray-500">{user?.email || ''}</div>
                        </div>
                        <Link
                          to="/settings"
                          onClick={toggleDropdown}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Configuración
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Botón de menú móvil */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none"
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/settings') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              Configuración
            </Link>
            <Link
              to="/help"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/help') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              Ayuda
            </Link>
          </div>
          
          {/* Perfil móvil */}
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.name || 'Usuario'}</div>
                <div className="text-sm font-medium text-blue-200">{user?.email || ''}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AutoPrint. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;