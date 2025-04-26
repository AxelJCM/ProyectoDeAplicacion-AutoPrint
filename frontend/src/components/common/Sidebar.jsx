import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ printers = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out bg-gray-800 h-screen fixed left-0 top-0 z-30 overflow-x-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        {isOpen && (
          <span className="text-white font-semibold text-lg">AutoPrint</span>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          {isOpen ? (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-2">
        <Link
          to="/dashboard"
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/dashboard') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <svg 
            className={`${isOpen ? 'mr-4' : 'mx-auto'} h-6 w-6 text-gray-300`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {isOpen && <span>Dashboard</span>}
        </Link>

        {/* Impresoras sección */}
        {isOpen && printers.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Impresoras
            </h3>
            <div className="mt-2 space-y-1">
              {printers.map(printer => (
                <Link
                  key={printer.id}
                  to={`/printer/${printer.id}`}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(`/printer/${printer.id}`) 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className={`h-2 w-2 mr-3 rounded-full ${
                    printer.status === 'active' ? 'bg-green-400' :
                    printer.status === 'error' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}></span>
                  <span className="truncate">{printer.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Configuración */}
        <div className={`${isOpen ? 'mt-8' : 'mt-4'}`}>
          {isOpen && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Configuración
            </h3>
          )}
          <div className={`${isOpen ? 'mt-2 space-y-1' : ''}`}>
            <Link
              to="/settings"
              className={`group flex items-center px-2 py-2 text-${isOpen ? 'sm' : 'base'} font-medium rounded-md ${
                isActive('/settings') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg 
                className={`${isOpen ? 'mr-3 h-5 w-5' : 'mx-auto h-6 w-6'} text-gray-300`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {isOpen && <span>Configuración</span>}
            </Link>
            
            <Link
              to="/help"
              className={`group flex items-center px-2 py-2 text-${isOpen ? 'sm' : 'base'} font-medium rounded-md ${
                isActive('/help') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg 
                className={`${isOpen ? 'mr-3 h-5 w-5' : 'mx-auto h-6 w-6'} text-gray-300`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isOpen && <span>Ayuda</span>}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;