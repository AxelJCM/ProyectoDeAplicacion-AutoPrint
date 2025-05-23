# Instrucciones para despliegue del sistema AutoPrint

## 1. Raspberry Pi (Cliente de sensores)
Coloca los siguientes archivos en la Raspberry Pi:
- `dht22_reader.py`
- (Opcional) `camera_capture.py` si usas cámara

Estos archivos están en la carpeta `sensors/` de este proyecto. Puedes copiarlos a una carpeta llamada `raspberry_client/` para mayor claridad.

### Requisitos en la Raspberry Pi:
- Python 3
- Instalar dependencias:
  ```bash
  pip install Adafruit_DHT paho-mqtt
  ```
- Edita `dht22_reader.py` y cambia la línea:
  ```python
  MQTT_BROKER = "localhost"
  ```
  por
  ```python
  MQTT_BROKER = "IP_DE_TU_COMPUTADORA"
  # Ejemplo: MQTT_BROKER = "192.168.1.100"
  ```

## 2. Computadora principal (Frontend y Backend)
- El backend está en la carpeta `backend/` (corre `app.py`)
- El frontend está en la carpeta `frontend/` (React)

### Requisitos en la computadora:
- Python 3 y Node.js
- Instalar dependencias backend:
  ```powershell
  pip install flask flask-cors paho-mqtt
  ```
- Instalar dependencias frontend:
  ```powershell
  cd frontend
  npm install
  ```

### Ejecución:
- Corre el backend:
  ```powershell
  python backend/app.py
  ```
- Corre el frontend:
  ```powershell
  cd frontend
  npm start
  ```

## Estructura recomendada
```
ProyectoDeAplicacion---AutoPrint/
├── backend/
├── database/
├── frontend/
├── raspberry_client/
│   ├── dht22_reader.py
│   └── camera_capture.py
└── ...
```

Así tendrás todo organizado y listo para desplegar.
