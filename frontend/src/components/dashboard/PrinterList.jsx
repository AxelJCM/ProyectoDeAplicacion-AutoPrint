import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConnectedPrinters } from '../../services/api';

const PrinterList = () => {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const data = await fetchConnectedPrinters();
        setPrinters(data);
      } catch (err) {
        console.error('Error fetching printers:', err);
        setError('No se pudieron cargar las impresoras. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadPrinters();
    // Configurar un intervalo para actualizar la lista cada 30 segundos
    const interval = setInterval(loadPrinters, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePrinterClick = (printerId) => {
    navigate(`/printer/${printerId}`);
  };

  // Función para determinar el color de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Impresoras Conectadas</h1>
      
      {printers.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-lg">
          <p className="text-gray-600 mb-4">No hay impresoras conectadas</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refrescar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printers.map((printer) => (
            <div 
              key={printer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handlePrinterClick(printer.id)}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{printer.name}</h2>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(printer.status)}`}></div>
                </div>
                <p className="text-gray-600 text-sm">ID: {printer.id}</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Modelo:</span>
                  <span>{printer.model}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">IP:</span>
                  <span>{printer.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={printer.status === 'error' ? 'text-red-600 font-semibold' : ''}> 
                    {printer.status === 'active' && 'Activa'}
                    {printer.status === 'idle' && 'Inactiva'}
                    {printer.status === 'error' && 'Error'}
                    {!['active', 'idle', 'error'].includes(printer.status) && printer.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 text-right">
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver detalles →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrinterList;