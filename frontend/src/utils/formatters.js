/**
 * Formatea una fecha en formato local
 * @param {string|Date} date - La fecha a formatear
 * @param {boolean} includeTime - Si incluir la hora en el formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = false) => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    
    const options = includeTime 
      ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };
    
    return dateObj.toLocaleDateString('es-ES', options);
  };
  
  /**
   * Formatea un número con decimales específicos
   * @param {number} value - El valor a formatear
   * @param {number} decimals - Número de decimales
   * @returns {string} Número formateado
   */
  export const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toFixed(decimals);
  };
  
  /**
   * Formatea un valor de temperatura agregando el símbolo
   * @param {number} temp - Valor de temperatura
   * @returns {string} Temperatura formateada
   */
  export const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${formatNumber(temp)}°C`;
  };
  
  /**
   * Formatea un valor de humedad agregando el símbolo
   * @param {number} humidity - Valor de humedad
   * @returns {string} Humedad formateada
   */
  export const formatHumidity = (humidity) => {
    if (humidity === null || humidity === undefined) return 'N/A';
    return `${formatNumber(humidity)}%`;
  };
  
  /**
   * Formatea un estado de impresora para visualización
   * @param {string} status - Estado de la impresora
   * @returns {string} Estado formateado
   */
  export const formatPrinterStatus = (status) => {
    const statusMap = {
      'active': 'Activa',
      'idle': 'Inactiva',
      'error': 'Error',
      'maintenance': 'Mantenimiento',
      'offline': 'Desconectada'
    };
    
    return statusMap[status] || status;
  };
  
  /**
   * Formatea un nivel de riesgo para visualización
   * @param {string} level - Nivel de riesgo
   * @returns {string} Nivel formateado
   */
  export const formatRiskLevel = (level) => {
    const levelMap = {
      'high': 'Alto',
      'medium': 'Medio',
      'low': 'Bajo'
    };
    
    return levelMap[level] || level;
  };