#!/bin/bash
cd /Home/AutoPrint/backend
source venv/bin/activate
python app.py &
python mqtt_client.py &