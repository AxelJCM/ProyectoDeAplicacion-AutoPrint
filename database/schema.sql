-- SQL para crear la tabla de datos de sensores
CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temp REAL NOT NULL,
    hum REAL NOT NULL,
    timestamp TEXT NOT NULL
);

-- SQL para crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- SQL para crear la tabla de impresoras
CREATE TABLE IF NOT EXISTS printers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    location TEXT
);

-- SQL para crear la tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    printer_id INTEGER,
    event_type TEXT,
    description TEXT,
    timestamp TEXT,
    FOREIGN KEY(printer_id) REFERENCES printers(id)
);

-- SQL para crear la tabla de alertas
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    printer_id INTEGER,
    message TEXT,
    level TEXT,
    timestamp TEXT,
    FOREIGN KEY(printer_id) REFERENCES printers(id)
);
