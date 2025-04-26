import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    dataRefreshInterval: 30,
    theme: 'light',
    language: 'es'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save settings to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Configuración guardada correctamente');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {/* Notifications */}
            <div>
              <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                  Activar notificaciones
                </label>
              </div>
            </div>
            
            {/* Refresh Rate */}
            <div>
              <h3 className="text-lg font-medium mb-4">Actualización de Datos</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo de actualización (segundos)
              </label>
              <select 
                name="dataRefreshInterval"
                value={settings.dataRefreshInterval}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="10">10 segundos</option>
                <option value="30">30 segundos</option>
                <option value="60">1 minuto</option>
                <option value="300">5 minutos</option>
              </select>
            </div>
            
            {/* Theme */}
            <div>
              <h3 className="text-lg font-medium mb-4">Apariencia</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="light"
                    name="theme"
                    type="radio"
                    value="light"
                    checked={settings.theme === 'light'}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700">
                    Claro
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="dark"
                    name="theme"
                    type="radio"
                    value="dark"
                    checked={settings.theme === 'dark'}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700">
                    Oscuro
                  </label>
                </div>
              </div>
            </div>
            
            {/* Language */}
            <div>
              <h3 className="text-lg font-medium mb-4">Idioma</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar idioma
              </label>
              <select 
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
            
            {/* Submit */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;