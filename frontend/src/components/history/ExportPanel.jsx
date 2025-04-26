import React, { useState } from 'react';
import { exportPrinterData } from '../../services/api';
import { formatDate } from '../../utils/formatters';

const ExportPanel = ({ printerId }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    startDate: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    endDate: formatDate(new Date())
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');
      
      const blob = await exportPrinterData(printerId, exportFormat, dateRange);
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Generar nombre de archivo
      const fileName = `autoprint_data_${printerId}_${dateRange.startDate}_to_${dateRange.endDate}.${exportFormat}`;
      a.download = fileName;
      
      // Agregar a DOM, hacer clic y remover
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Ocurrió un error al exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-6">Exportar Datos de la Impresora</h3>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Formato de exportación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Exportación</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="csv"
                name="exportFormat"
                type="radio"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="csv" className="ml-2 block text-sm text-gray-700">
                CSV
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="json"
                name="exportFormat"
                type="radio"
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="json" className="ml-2 block text-sm text-gray-700">
                JSON
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="pdf"
                name="exportFormat"
                type="radio"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="pdf" className="ml-2 block text-sm text-gray-700">
                PDF
              </label>
            </div>
          </div>
        </div>
        
        {/* Rango de fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">Desde</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Opciones adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Datos a incluir</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                id="includeTemperature"
                name="includeTemperature"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="includeTemperature" className="ml-2 block text-sm text-gray-700">
                Temperatura
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="includeHumidity"
                name="includeHumidity"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="includeHumidity" className="ml-2 block text-sm text-gray-700">
                Humedad
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="includeAlerts"
                name="includeAlerts"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="includeAlerts" className="ml-2 block text-sm text-gray-700">
                Alertas
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="includeStatus"
                name="includeStatus"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="includeStatus" className="ml-2 block text-sm text-gray-700">
                Estado
              </label>
            </div>
          </div>
        </div>
        
        {/* Botón de exportación */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleExport}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Exportando...' : 'Exportar Datos'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;