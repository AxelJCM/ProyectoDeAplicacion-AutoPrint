import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchConnectedPrinters } from '../../services/api';
import { formatDate, formatPrinterStatus } from '../../utils/formatters';

// Add this near the top of Dashboard.jsx
const MOCK_PRINTERS = [
  {
    id: 'printer1',
    name: 'Impresora A1',
    status: 'active',
    temperature: { bed: 60, nozzle: 210 },
    humidity: 45,
    alerts: []
  },
  {
    id: 'printer2',
    name: 'Impresora B2',
    status: 'active',
    temperature: { bed: 55, nozzle: 195 },
    humidity: 40,
    alerts: [{ type: 'warning', message: 'Filamento bajo' }]
  }
];

const Dashboard = () => {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoading(true);
        let data;
        try {
          data = await fetchConnectedPrinters();
        } catch (error) {
          console.warn('Using mock data due to API error:', error);
          data = MOCK_PRINTERS;
        }
        setPrinters(data);
        // Calculate stats...
      } finally {
        setLoading(false);
      }
    };
    
    loadPrinters();
  }, []);

  // Filtrar impresoras según búsqueda y filtro de estado
  const filteredPrinters = printers.filter(printer => {
    const matchesQuery = 
      printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      printer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || printer.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });

  // Función para obtener clase de color según estado
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : printers.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay impresoras</h3>
          <p className="mt-1 text-sm text-gray-500">No se encontraron impresoras conectadas.</p>
        </div>
      ) : (
        <>
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Dashboard de Impresoras
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Impresora
              </button>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="relative rounded-md shadow-sm w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar impresora..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mt-4 md:mt-0">
                <select
                  id="status-filter"
                  name="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activa</option>
                  <option value="idle">Inactiva</option>
                  <option value="error">Error</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="offline">Desconectada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de impresoras */}
          {error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredPrinters.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron impresoras</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay impresoras que coincidan con los criterios de búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrinters.map((printer) => (
                <Link 
                  key={printer.id} 
                  to={`/printer/${printer.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-shrink-0 mr-4">
                        <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{printer.name}</h3>
                        <p className="text-sm text-gray-500">{printer.model}</p>
                        <p className="text-sm text-gray-500">
                          <svg className="inline-block h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {printer.location}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(printer.status)}`}>
                          {formatPrinterStatus(printer.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Temperatura</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{printer.temperature ? `${printer.temperature}°C` : 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Humedad</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{printer.humidity ? `${printer.humidity}%` : 'N/A'}</dd>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(printer.lastUpdate, true)}</dd>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <div className="font-medium text-blue-600 hover:text-blue-500">
                        Ver detalles
                        <span aria-hidden="true"> &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;