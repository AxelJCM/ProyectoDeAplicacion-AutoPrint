from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)  # Permitir CORS para React
key = Fernet.generate_key()  # Guardar esta clave de forma segura

# Ruta para obtener datos
@app.route('/api/status')
def get_status():
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1")
    data = cursor.fetchone()
    conn.close()
    return jsonify({"temp": data[1], "hum": data[2]})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)