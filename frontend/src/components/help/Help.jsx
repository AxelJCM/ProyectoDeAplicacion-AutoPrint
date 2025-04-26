import React from 'react';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ayuda y Soporte</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg text-gray-800 mb-2">¿Cómo interpreto los datos de temperatura?</h3>
              <p className="text-gray-600">
                Los gráficos de temperatura muestran las variaciones en tiempo real. Las líneas amarillas indican límites seguros,
                mientras que las rojas marcan niveles críticos que requieren atención inmediata.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-gray-800 mb-2">¿Cómo configurar notificaciones?</h3>
              <p className="text-gray-600">
                Dirígete a Configuración &gt; Notificaciones para personalizar cómo y cuándo recibir alertas
                sobre el estado de tus impresoras.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-gray-800 mb-2">¿Cómo exportar datos históricos?</h3>
              <p className="text-gray-600">
                En la sección de Historial de cada impresora, encontrarás la pestaña "Exportar Datos" 
                donde podrás seleccionar formato y rango de fechas para tu reporte.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contacto de Soporte</h2>
          <p className="mb-4 text-gray-600">
            Si necesitas ayuda adicional, por favor contacta a nuestro equipo de soporte:
          </p>
          
          <div className="flex items-center mb-4">
            <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">soporte@autoprint.com</span>
          </div>
          
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-700">+506 2550-2225</span>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recursos</h2>
          <ul className="space-y-3">
            <li className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <a href="/manual">Manual de Usuario (PDF)</a>
            </li>
            <li className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <a href="/faq">Preguntas Frecuentes</a>
            </li>
            <li className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <a href="/tutorials">Videotutoriales</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Help;