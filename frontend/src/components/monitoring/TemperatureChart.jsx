import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { formatDate } from '../../utils/formatters';
import { CHART_COLORS, TEMPERATURE_LIMITS } from '../../utils/constants';

const TemperatureChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Destruir gráfico existente si hay uno
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Preparar datos para el gráfico
    const chartData = {
      labels: data.map(d => formatDate(d.timestamp, true)),
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: data.map(d => d.value),
          fill: true,
          backgroundColor: CHART_COLORS.TEMPERATURE.FILL,
          borderColor: CHART_COLORS.TEMPERATURE.LINE,
          tension: 0.4,
          pointRadius: 3,
        },
      ],
    };
    
    // Configuración del gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => `Temperatura: ${context.raw.toFixed(1)}°C`,
            },
          },
          annotation: {
            annotations: {
              warningLine: {
                type: 'line',
                yMin: TEMPERATURE_LIMITS.MAX_SAFE,
                yMax: TEMPERATURE_LIMITS.MAX_SAFE,
                borderColor: 'rgba(255, 204, 0, 0.5)',
                borderWidth: 2,
                label: {
                  content: 'Límite seguro',
                  enabled: true,
                  position: 'end',
                }
              },
              criticalLine: {
                type: 'line',
                yMin: TEMPERATURE_LIMITS.CRITICAL,
                yMax: TEMPERATURE_LIMITS.CRITICAL,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 2,
                label: {
                  content: 'Crítico',
                  enabled: true,
                  position: 'end',
                }
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              maxTicksLimit: 6,
              callback: function(value, index, values) {
                if (index === 0 || index === values.length - 1) {
                  return this.getLabelForValue(value);
                }
                return '';
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Temperatura (°C)'
            },
            min: Math.max(0, Math.min(...data.map(d => d.value)) - 5),
            max: Math.max(...data.map(d => d.value)) + 5,
          }
        }
      }
    });
    
    // Limpieza al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative h-60">
      {data && data.length > 0 ? (
        <canvas ref={chartRef}></canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
};

export default TemperatureChart;