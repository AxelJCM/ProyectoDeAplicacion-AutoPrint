import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPrinterDetails, fetchSensorData } from '../../services/api';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import AlertPanel from './AlertPanel';
import HistoryPanel from '../history/HistoryPanel';

const PrinterDetails = () => {
  const { printerId } = useParams();
  const [printer, setPrinter] = useState(null);
  const [sensorData, setSensorData] = useState({ temperature: [], humidity: [] });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrinterData = async () => {
      try {
        setLoading(true);
        // Cargar detalles de la impresora
        const printerDetails = await fetchPrinterDetails(printerId);
        setPrinter(printerDetails);
        
        // Cargar datos de sensores
        const data = await fetchSensorData(printerId);
        setSensorData(data);
      } catch (err) {
        console.error('Error loading printer data:', err);
        setError('No se pudieron cargar los datos de la impresora');
      } finally {
        setLoading(false);
      }
    };

    loadPrinterData();
    
    // Configurar intervalo para actualizar datos cada 5 segundos
    const interval = setInterval(async () => {
      try {
        const data = await fetchSensorData(printerId);
        setSensorData(data);
      } catch (err) {
        console.error('Error updating sensor data:', err);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [printerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{printer?.name}</h1>
          <p className="text-gray-600">ID: {printer?.id} | Modelo: {printer?.model}</p>
        </div>
        <div className="flex items-center">
          <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
            printer?.status === 'active' ? 'bg-green-500' : 
            printer?.status === 'idle' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}></span>
          <span>
            {printer?.status === 'active' ? 'Activa' : 
             printer?.status === 'idle' ? 'Inactiva' : 
             'Error'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'dashboard' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Panel de Control
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'alerts' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('alerts')}
            >
              Alertas
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Historial
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Temperatura */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Temperatura</h3>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-3xl font-bold">
                    {sensorData.temperature.length > 0 
                      ? `${sensorData.temperature[sensorData.temperature.length - 1].value.toFixed(1)}°C` 
                      : 'N/A'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    (sensorData.temperature.length > 0 && 
                     sensorData.temperature[sensorData.temperature.length - 1].value > 30) 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sensorData.temperature.length > 0 && 
                     sensorData.temperature[sensorData.temperature.length - 1].value > 30
                      ? 'Alto' 
                      : 'Normal'}
                  </div>
                </div>
                <TemperatureChart data={sensorData.temperature} />
              </div>
              
              {/* Humedad */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Humedad</h3>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-3xl font-bold">
                    {sensorData.humidity.length > 0 
                      ? `${sensorData.humidity[sensorData.humidity.length - 1].value.toFixed(1)}%` 
                      : 'N/A'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    (sensorData.humidity.length > 0 && 
                     sensorData.humidity[sensorData.humidity.length - 1].value > 60) 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sensorData.humidity.length > 0 && 
                     sensorData.humidity[sensorData.humidity.length - 1].value > 60
                      ? 'Elevado' 
                      : 'Normal'}
                  </div>
                </div>
                <HumidityChart data={sensorData.humidity} />
              </div>
            </div>
            
            {/* Estado de la impresora */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Estado actual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-md p-3">
                  <div className="text-gray-600 text-sm">Tiempo activo</div>
                  <div className="font-semibold">{printer?.uptimeHours || 0} horas</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-600 text-sm">Material</div>
                  <div className="font-semibold">{printer?.material || 'PLA'}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-600 text-sm">Progreso</div>
                  <div className="font-semibold">{printer?.progress || '0'}%</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-600 text-sm">Última revisión</div>
                  <div className="font-semibold">{printer?.lastMaintenance || 'No disponible'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && <AlertPanel printerId={printerId} />}
        
        {activeTab === 'history' && <HistoryPanel printerId={printerId} />}
      </div>
    </div>
  );
};

export default PrinterDetails;