# Este archivo es una copia del script de sensores para la Raspberry Pi.
# Recuerda editar la IP del broker MQTT antes de usarlo en la Raspberry Pi.

import Adafruit_DHT
import time
import paho.mqtt.publish as publish

# Configuración MQTT
MQTT_BROKER = "IP_DE_TU_COMPUTADORA"  # Cambia esto por la IP real
MQTT_TOPIC = "autoprint/sensors/dht22"
PRINTER_ID = 1  # Cambia esto por el ID de la impresora correspondiente

def read_dht22():
    sensor = Adafruit_DHT.DHT22
    pin = 4  # GPIO4 en Raspberry Pi
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    if humidity is not None and temperature is not None:
        data = {
            "printer_id": PRINTER_ID,
            "temp": round(temperature, 2),
            "hum": round(humidity, 2),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        publish.single(MQTT_TOPIC, str(data), hostname=MQTT_BROKER)
    else:
        print("Error lectura DHT22")

if __name__ == "__main__":
    while True:
        read_dht22()
        time.sleep(10)  # Enviar datos cada 10 segundos
