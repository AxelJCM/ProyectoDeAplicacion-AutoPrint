import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPrinterDetails, fetchSensorData, fetchAlerts } from '../../services/api';
import { formatDate, formatTemperature, formatHumidity, formatPrinterStatus } from '../../utils/formatters';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import HistoryPanel from '../history/HistoryPanel';
import mqttService from '../../services/mqtt';
import { SENSOR_DATA_UPDATE_INTERVAL } from '../../utils/constants';

const PrinterDetails = () => {
  const { printerId } = useParams();
  const [printer, setPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sensorData, setSensorData] = useState({
    temperature: [],
    humidity: []
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadPrinterDetails = async () => {
      try {
        setLoading(true);
        // Cargar detalles de la impresora
        const printerData = await fetchPrinterDetails(printerId);
        setPrinter(printerData);

        // Cargar datos históricos de sensores
        const sensorHistory = await fetchSensorData(printerId);
        setSensorData(sensorHistory);

        // Cargar alertas
        const alertsData = await fetchAlerts(printerId);
        setAlerts(alertsData);

        // Suscribir a tópicos MQTT para actualizaciones en tiempo real
        subscribeToMqttTopics(printerId);

      } catch (err) {
        console.error('Error loading printer details:', err);
        setError('No se pudieron cargar los detalles de la impresora');
      } finally {
        setLoading(false);
      }
    };

    loadPrinterDetails();

    // Configurar intervalo para actualizar datos de sensores
    const intervalId = setInterval(() => {
      fetchSensorData(printerId)
        .then(data => setSensorData(data))
        .catch(err => console.error('Error updating sensor data:', err));
      
      fetchAlerts(printerId)
        .then(data => setAlerts(data))
        .catch(err => console.error('Error updating alerts:', err));
    }, SENSOR_DATA_UPDATE_INTERVAL);

    // Limpiar al desmontar
    return () => {
      clearInterval(intervalId);
      unsubscribeFromMqttTopics(printerId);
    };
  }, [printerId]);

  // Suscribirse a tópicos MQTT
  const subscribeToMqttTopics = (id) => {
    // Tópico para estado general
    mqttService.subscribe(`printer/${id}/status`, (message) => {
      setPrinter(prev => ({ ...prev, ...message }));
    });

    // Tópico para temperatura
    mqttService.subscribe(`printer/${id}/temperature`, (message) => {
      if (typeof message === 'object' && message.value !== undefined) {
        setSensorData(prev => ({
          ...prev,
          temperature: [...prev.temperature, message]
        }));
        setPrinter(prev => ({ ...prev, temperature: message.value }));
      }
    });

    // Tópico para humedad
    mqttService.subscribe(`printer/${id}/humidity`, (message) => {
      if (typeof message === 'object' && message.value !== undefined) {
        setSensorData(prev => ({
          ...prev,
          humidity: [...prev.humidity, message]
        }));
        setPrinter(prev => ({ ...prev, humidity: message.value }));
      }
    });

    // Tópico para alertas
    mqttService.subscribe(`printer/${id}/alerts`, (message) => {
      if (Array.isArray(message)) {
        setAlerts(message);
      } else if (typeof message === 'object') {
        setAlerts(prev => [...prev, message]);
      }
    });
  };

  // Cancelar suscripciones MQTT
  const unsubscribeFromMqttTopics = (id) => {
    mqttService.unsubscribe(`printer/${id}/status`);
    mqttService.unsubscribe(`printer/${id}/temperature`);
    mqttService.unsubscribe(`printer/${id}/humidity`);
    mqttService.unsubscribe(`printer/${id}/alerts`);
  };

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

  // Función para obtener clase de color según nivel de riesgo
  const getRiskColorClass = (level) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
    );
  }

  if (!printer) {
    return (
      <div className="text-center">
        <p>No se encontró información de esta impresora.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {printer.name}
              <span className={`ml-3 px-2 py-1 text-sm font-semibold rounded-full ${getStatusColorClass(printer.status)}`}>
                {formatPrinterStatus(printer.status)}
              </span>
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{printer.model}</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Configurar
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Control Remoto
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{printer.location}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nivel de Riesgo</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`font-medium ${getRiskColorClass(printer.riskLevel)}`}>
                  {printer.riskLevel === 'high' && 'Alto'}
                  {printer.riskLevel === 'medium' && 'Medio'}
                  {printer.riskLevel === 'low' && 'Bajo'}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(printer.lastUpdate, true)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID del Dispositivo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{printer.id}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            General
          </button>
          <button
            className={`${
              activeTab === 'sensors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('sensors')}
          >
            Sensores
          </button>
          <button
            className={`${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('alerts')}
          >
            Alertas
            {alerts.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                {alerts.length}
              </span>
            )}
          </button>
          <button
            className={`${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
        </nav>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'overview' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Resumen</h3>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Tarjeta de temperatura */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Temperatura</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatTemperature(printer.temperature)}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de humedad */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Humedad</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatHumidity(printer.humidity)}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de estado */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Estado Operativo</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatPrinterStatus(printer.status)}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráfico resumen */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tendencia de Temperatura (24h)</h4>
              <div className="h-64">
                <TemperatureChart data={sensorData.temperature} />
              </div>
            </div>
            
            {/* Alertas recientes */}
            {alerts.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Alertas Recientes</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {alerts.slice(0, 3).map((alert) => (
                      <li key={alert.id} className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-500">{formatDate(alert.timestamp, true)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {alerts.length > 3 && (
                    <div className="bg-gray-50 px-4 py-3 text-center">
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-500"
                        onClick={() => setActiveTab('alerts')}
                      >
                        Ver todas ({alerts.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Datos de Sensores</h3>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Gráfico de temperatura */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium text-gray-900 mb-4">Temperatura</h4>
                <div className="h-64">
                  <TemperatureChart data={sensorData.temperature} />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <strong>Actual:</strong>
                  {formatTemperature(printer.temperature)}
                </div>
              </div>

              {/* Gráfico de humedad */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium text-gray-900 mb-4">Humedad</h4>
                <div className="h-64">
                  <HumidityChart data={sensorData.humidity} />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <strong>Actual:</strong>
                  {formatHumidity(printer.humidity)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Alertas</h3>
            <ul className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-500">{formatDate(alert.timestamp, true)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'history' && <HistoryPanel printerId={printerId} />}
    </div>
  );
};

export default PrinterDetails;