import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { formatDate } from '../../utils/formatters';
import { CHART_COLORS, HUMIDITY_LIMITS } from '../../utils/constants';

const HumidityChart = ({ data = [] }) => {
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
          label: 'Humedad (%)',
          data: data.map(d => d.value),
          fill: true,
          backgroundColor: CHART_COLORS.HUMIDITY.FILL,
          borderColor: CHART_COLORS.HUMIDITY.LINE,
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
              label: (context) => `Humedad: ${context.raw.toFixed(1)}%`,
            },
          },
          annotation: {
            annotations: {
              warningLine: {
                type: 'line',
                yMin: HUMIDITY_LIMITS.MAX_SAFE,
                yMax: HUMIDITY_LIMITS.MAX_SAFE,
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
                yMin: HUMIDITY_LIMITS.CRITICAL,
                yMax: HUMIDITY_LIMITS.CRITICAL,
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
              text: 'Humedad (%)'
            },
            min: Math.max(0, Math.min(...data.map(d => d.value)) - 5),
            max: Math.min(100, Math.max(...data.map(d => d.value)) + 5),
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

export default HumidityChart;