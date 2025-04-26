import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-6xl font-medium py-8">Página no encontrada</h2>
        <p className="text-2xl pb-8 px-12 font-medium">La página que estás buscando no existe o ha sido movida.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300"
        >
          Volver al Inicio
        </Link>
      </div>
      
      <div className="mt-12">
        <svg 
          className="w-64 h-64 text-blue-600 opacity-20" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
        </svg>
      </div>
    </div>
  );
};

export default NotFound;