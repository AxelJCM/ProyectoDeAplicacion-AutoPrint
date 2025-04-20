import Adafruit_DHT
import time
import paho.mqtt.publish as publish

# Configuración MQTT
MQTT_BROKER = "localhost"
MQTT_TOPIC = "autoprint/sensors/dht22"

def read_dht22():
    sensor = Adafruit_DHT.DHT22
    pin = 4  # GPIO4 en Raspberry Pi
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    if humidity is not None and temperature is not None:
        data = {
            "temp": round(temperature, 2),
            "hum": round(humidity, 2),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        # Publicar datos via MQTT
        publish.single(MQTT_TOPIC, str(data), hostname=MQTT_BROKER)
    else:
        print("Error lectura DHT22")

if __name__ == "__main__":
    while True:
        read_dht22()
        time.sleep(10)  # Enviar datos cada 10 segundos