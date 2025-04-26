import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTemperature, formatHumidity, formatPrinterStatus } from '../../utils/formatters';

const PrinterCard = ({ printer }) => {
  // Función para determinar el color de estado
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
    <Link 
      to={`/printer/${printer.id}`}
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-transform duration-300 hover:scale-105"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 mr-4">
            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {formatTemperature(printer.temperature)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Humedad</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {formatHumidity(printer.humidity)}
            </dd>
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
  );
};

export default PrinterCard;