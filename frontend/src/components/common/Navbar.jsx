import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path || 
      (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y enlaces de navegación (escritorio) */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">AutoPrint</h1>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
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
          
          {/* Menú de usuario (escritorio) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Icono de notificación */}
              <button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                <span className="sr-only">Ver notificaciones</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Perfil usuario dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button 
                    onClick={handleDropdownToggle}
                    className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white" 
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>
                </div>
                
                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="user-menu-button" 
                    tabIndex="-1"
                  >
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.name || 'Usuario'}
                      <div className="text-xs text-gray-500">{user?.email || ''}</div>
                    </div>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem" 
                      tabIndex="-1" 
                      id="user-menu-item-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Configuración
                    </Link>
                    <button 
                      type="button" 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem" 
                      tabIndex="-1" 
                      id="user-menu-item-2"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={handleMenuToggle}
              type="button" 
              className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white" 
              aria-controls="mobile-menu" 
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/settings" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/settings') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700'
              }`}
            >
              Configuración
            </Link>
            <Link 
              to="/help" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/help') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700'
              }`}
            >
              Ayuda
            </Link>
          </div>
          
          {/* Perfil usuario móvil */}
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user?.name || 'Usuario'}</div>
                <div className="text-sm font-medium leading-none text-blue-200">{user?.email || ''}</div>
              </div>
              <button className="ml-auto bg-blue-600 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
                <span className="sr-only">Ver notificaciones</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link 
                to="/settings" 
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700"
              >
                Configuración
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;