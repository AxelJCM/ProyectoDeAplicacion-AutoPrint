# models/sensor.py
from abc import ABC, abstractmethod

class Sensor(ABC):
    def __init__(self, sensor_id, sensor_type):
        self.sensor_id = sensor_id
        self.sensor_type = sensor_type
        self.value = None

    @abstractmethod
    def read_data(self):
        pass