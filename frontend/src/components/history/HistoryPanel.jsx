import React, { useState, useEffect } from 'react';
import { fetchPrinterHistory } from '../../services/api';
import EventLog from './EventLog';
import ExportPanel from './ExportPanel';
import { formatDate } from '../../utils/formatters';

const HistoryPanel = ({ printerId }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    endDate: formatDate(new Date()),
    eventType: 'all'
  });

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchPrinterHistory(printerId, {
          startDate: filters.startDate,
          endDate: filters.endDate,
          eventType: filters.eventType !== 'all' ? filters.eventType : undefined
        });
        setHistory(data);
      } catch (err) {
        console.error('Error loading history:', err);
        setError('No se pudo cargar el historial');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [printerId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Historial de la Impresora</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'events' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('events')}
            >
              Eventos
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'export' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('export')}
            >
              Exportar Datos
            </button>
          </li>
        </ul>
      </div>

      {/* Filtros */}
      {activeTab === 'events' && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input 
                type="date" 
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input 
                type="date" 
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="alert">Alertas</option>
                <option value="status">Cambios de Estado</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="print">Impresiones</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la Tab */}
      {activeTab === 'events' && (
        <EventLog 
          events={history} 
          loading={loading} 
          error={error}
          onRetry={() => setFilters({...filters})}
        />
      )}
      
      {activeTab === 'export' && (
        <ExportPanel printerId={printerId} />
      )}
    </div>
  );
};

export default HistoryPanel;