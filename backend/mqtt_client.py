import paho.mqtt.client as mqtt
from flask import current_app

def on_connect(client, userdata, flags, rc):
    print("Conectado a MQTT")
    client.subscribe("autoprint/sensors/#")

def on_message(client, userdata, msg):
    # Procesar mensajes aquí (ej: guardar en DB)
    print(f"Datos recibidos: {msg.payload.decode()}")

# Iniciar cliente en segundo plano
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("localhost", 1883, 60)
client.loop_start()