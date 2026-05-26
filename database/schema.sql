CREATE DATABASE IF NOT EXISTS garage_management;
USE garage_management;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  plate_number VARCHAR(30) NOT NULL,
  make VARCHAR(60) NOT NULL,
  model VARCHAR(60) NOT NULL,
  year INT,
  vin VARCHAR(40),
  status VARCHAR(30) DEFAULT 'Waiting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicles_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  service_type VARCHAR(120) NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'Open',
  priority VARCHAR(30) DEFAULT 'Normal',
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  opened_at DATETIME NOT NULL,
  closed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_orders_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
