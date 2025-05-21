from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import mqtt_client 
import hashlib

app = Flask(__name__)
CORS(app)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Datos incompletos'}), 400
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hash_password(password)))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Usuario ya existe'}), 409
    conn.close()
    return jsonify({'status': 'registrado'})

# --------- AUTENTICACIÓN ---------
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT password FROM users WHERE username = ?', (username,))
    row = cursor.fetchone()
    conn.close()
    if row and row[0] == hash_password(password):
        return jsonify({'token': 'fake-jwt-token'})
    return jsonify({'error': 'Credenciales inválidas'}), 401

# --------- IMPRESORAS ---------
@app.route('/api/printers', methods=['GET'])
def get_printers():
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, status, location FROM printers')
    printers = [
        {'id': row[0], 'name': row[1], 'status': row[2], 'location': row[3]} for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(printers)

@app.route('/api/printers/<int:printer_id>', methods=['GET'])
def get_printer(printer_id):
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, status, location FROM printers WHERE id = ?', (printer_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({'id': row[0], 'name': row[1], 'status': row[2], 'location': row[3]})
    return jsonify({'error': 'Impresora no encontrada'}), 404

# --------- SENSORES ---------
@app.route('/api/sensors/data', methods=['POST'])
def receive_sensor_data():
    data = request.json
    temp = data.get('temp')
    hum = data.get('hum')
    timestamp = data.get('timestamp')
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO sensor_data (temp, hum, timestamp) VALUES (?, ?, ?)', (temp, hum, timestamp))
    conn.commit()
    conn.close()
    mqtt_client.client.publish('autoprint/sensors/dht22', str(data))
    return jsonify({'status': 'ok'})

# --------- HISTORIAL ---------
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, printer_id, event_type, description, timestamp FROM events ORDER BY timestamp DESC LIMIT 100')
    events = [
        {'id': row[0], 'printer_id': row[1], 'event_type': row[2], 'description': row[3], 'timestamp': row[4]} for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(events)

# --------- ALERTAS ---------
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, printer_id, message, level, timestamp FROM alerts ORDER BY timestamp DESC LIMIT 100')
    alerts = [
        {'id': row[0], 'printer_id': row[1], 'message': row[2], 'level': row[3], 'timestamp': row[4]} for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(alerts)

# --------- CONFIGURACIÓN USUARIO ---------
@app.route('/api/user/settings', methods=['GET'])
def get_user_settings():
    return jsonify({'theme': 'dark', 'notifications': True})

@app.route('/api/user/settings', methods=['POST'])
def update_user_settings():
    settings = request.json
    return jsonify({'status': 'updated'})

# --------- STATUS ---------
@app.route('/api/status', methods=['GET'])
def get_status():
    conn = sqlite3.connect('database/autoprint.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1')
    data = cursor.fetchone()
    conn.close()
    if data:
        return jsonify({'temp': data[1], 'hum': data[2]})
    return jsonify({'error': 'No data'}), 404

@app.route('/')
def root():
    return jsonify({'message': 'API AutoPrint Backend'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)