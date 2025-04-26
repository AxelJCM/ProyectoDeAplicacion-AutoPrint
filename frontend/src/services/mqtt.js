import mqtt from 'mqtt';
import { MQTT_BROKER_URL } from '../utils/constants';

class MQTTService {
  constructor() {
    this.client = null;
    this.topicSubscriptions = new Map();
  }

  // Conectar al broker MQTT
  connect() {
    if (this.client) return;

    this.client = mqtt.connect(MQTT_BROKER_URL);
    
    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      // Resubscribir a los tópicos previos al reconectarse
      if (this.topicSubscriptions.size > 0) {
        this.topicSubscriptions.forEach((callbacks, topic) => {
          this.client.subscribe(topic);
        });
      }
    });

    this.client.on('message', (topic, message) => {
      const callbacks = this.topicSubscriptions.get(topic) || [];
      const parsedMessage = this._parseMessage(message.toString());
      
      callbacks.forEach(callback => {
        try {
          callback(parsedMessage, topic);
        } catch (error) {
          console.error(`Error en callback de MQTT para ${topic}:`, error);
        }
      });
    });

    this.client.on('error', (err) => {
      console.error('Error de conexión MQTT:', err);
    });

    this.client.on('offline', () => {
      console.warn('Cliente MQTT desconectado');
    });
  }

  // Desconectar del broker
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.topicSubscriptions.clear();
    }
  }

  // Suscribirse a un tópico
  subscribe(topic, callback) {
    if (!this.client) {
      this.connect();
    }

    if (!this.topicSubscriptions.has(topic)) {
      this.topicSubscriptions.set(topic, []);
      this.client.subscribe(topic);
    }
    
    this.topicSubscriptions.get(topic).push(callback);
  }

  // Cancelar suscripción
  unsubscribe(topic, callback = null) {
    if (!this.client || !this.topicSubscriptions.has(topic)) return;

    if (callback === null) {
      // Cancelar todas las suscripciones para este tópico
      this.topicSubscriptions.delete(topic);
      this.client.unsubscribe(topic);
    } else {
      // Eliminar solo el callback específico
      const callbacks = this.topicSubscriptions.get(topic).filter(cb => cb !== callback);
      
      if (callbacks.length === 0) {
        this.topicSubscriptions.delete(topic);
        this.client.unsubscribe(topic);
      } else {
        this.topicSubscriptions.set(topic, callbacks);
      }
    }
  }

  // Publicar mensaje en un tópico
  publish(topic, message) {
    if (!this.client) {
      this.connect();
    }

    const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
    this.client.publish(topic, messageStr);
  }

  // Convertir mensaje string a objeto si es posible
  _parseMessage(messageStr) {
    try {
      return JSON.parse(messageStr);
    } catch (e) {
      return messageStr;
    }
  }
}

// Exportar una instancia singleton del servicio
export default new MQTTService();