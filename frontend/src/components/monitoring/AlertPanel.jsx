import React, { useState, useEffect } from 'react';
import { fetchAlerts } from '../../services/api';

const AlertPanel = ({ printerId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchAlerts(printerId);
        setAlerts(data);
      } catch (err) {
        console.error('Error loading alerts:', err);
        setError('No se pudieron cargar las alertas');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
    
    // Configurar intervalo para actualizar alertas cada 10 segundos
    const interval = setInterval(loadAlerts, 10000);
    
    return () => clearInterval(interval);
  }, [printerId]);

  // Función para obtener el color del nivel de riesgo
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
    <div>
      <h2 className="text-xl font-semibold mb-6">Sistema de Alertas</h2>
      
      {/* Semáforo de riesgo */}
      <div className="flex justify-center mb-10">
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${
              alerts.some(alert => alert.riskLevel === 'high') ? 'bg-red-500' : 'bg-red-200'
            }`}></div>
            <span className="mt-2 text-sm font-medium">Alto</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${
              alerts.some(alert => alert.riskLevel === 'medium') ? 'bg-yellow-500' : 'bg-yellow-200'
            }`}></div>
            <span className="mt-2 text-sm font-medium">Medio</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${
              !alerts.some(alert => ['high', 'medium'].includes(alert.riskLevel)) ? 'bg-green-500' : 'bg-green-200'
            }`}></div>
            <span className="mt-2 text-sm font-medium">Normal</span>
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      {alerts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay alertas activas</h3>
          <p className="mt-1 text-sm text-gray-500">La impresora está funcionando normalmente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className={`${getRiskColor(alert.riskLevel)} h-2`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{alert.title}</h3>
                    <p className="text-gray-600 text-sm">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    alert.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    alert.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.riskLevel === 'high' ? 'Alto' : 
                     alert.riskLevel === 'medium' ? 'Medio' : 'Bajo'}
                  </span>
                </div>
                
                <p className="mt-3">{alert.description}</p>
                
                {alert.recommendation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-semibold text-sm text-blue-800">Recomendación:</h4>
                    <p className="text-sm text-blue-700">{alert.recommendation}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Ignorar
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Resolver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;