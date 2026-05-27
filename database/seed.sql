USE garage_management;

-- =========================
-- CUSTOMERS
-- =========================
INSERT INTO customers (name, phone, email, address, notes, created_at) VALUES
('Amina Motors', '555-0191', 'aminamotors@example.com', 'Addis Ababa, Ethiopia', 'Fleet account - 10+ vehicles', NOW()),
('Bright Ride Logistics', '555-0144', 'ops@brightride.example', 'Bole, Addis Ababa', 'Priority repairs - logistics company', NOW()),
('Selam Taxi Service', '555-0112', 'contact@selamtaxi.com', 'Kazanchis, Addis Ababa', 'Taxi fleet maintenance', NOW()),
('Abel Tesfaye', '555-0177', 'abel@example.com', 'Piassa, Addis Ababa', 'Individual customer', NOW());

-- =========================
-- VEHICLES
-- =========================
INSERT INTO vehicles (customer_id, plate_number, make, model, year, vin, color, mileage, status, created_at) VALUES
(1, 'KAA-101A', 'Toyota', 'Hiace', 2019, 'VIN-TOY-001', 'White', 120000, 'Waiting', NOW()),
(1, 'KAA-102A', 'Toyota', 'Corolla', 2020, 'VIN-TOY-002', 'Silver', 80000, 'In Service', NOW()),
(2, 'KBB-220B', 'Isuzu', 'NPR', 2021, 'VIN-ISU-002', 'Blue', 60000, 'In Service', NOW()),
(3, 'KCC-330C', 'Hyundai', 'Accent', 2018, 'VIN-HYU-003', 'Black', 150000, 'Waiting', NOW()),
(4, 'KDD-440D', 'Suzuki', 'Alto', 2022, 'VIN-SUZ-004', 'Red', 20000, 'Completed', NOW());

-- =========================
-- MECHANICS
-- =========================
INSERT INTO mechanics (name, phone, specialty, hired_at) VALUES
('John Mekonnen', '555-0201', 'Engine Specialist', NOW()),
('Sara Bekele', '555-0202', 'Brake Systems', NOW()),
('Dawit Alemu', '555-0203', 'Electrical Systems', NOW());

-- =========================
-- SERVICE ORDERS
-- =========================
INSERT INTO service_orders (
  vehicle_id, mechanic_id, service_type, description,
  status, priority, estimated_cost, actual_cost,
  opened_at, closed_at
) VALUES
(1, 1, 'Oil Change', 'Routine maintenance and inspection', 'Open', 'Normal', 45.00, NULL, NOW(), NULL),
(2, 2, 'Brake Repair', 'Replace pads and inspect rotors', 'In Progress', 'High', 220.00, NULL, NOW(), NULL),
(3, 3, 'Electrical Fix', 'Battery and wiring inspection', 'Open', 'High', 150.00, NULL, NOW(), NULL),
(4, 2, 'Engine Repair', 'Engine overheating issue', 'In Progress', 'Urgent', 500.00, NULL, NOW(), NULL),
(5, 1, 'Full Service', 'Complete vehicle servicing', 'Completed', 'Normal', 300.00, 320.00, NOW(), NOW());

-- =========================
-- PAYMENTS
-- =========================
INSERT INTO payments (service_order_id, amount, payment_method, payment_status, paid_at) VALUES
(5, 320.00, 'Cash', 'Paid', NOW()),
(2, 100.00, 'Mobile Money', 'Partial', NOW());

-- =========================
-- INVENTORY (PARTS)
-- =========================
INSERT INTO parts (name, category, stock_quantity, unit_price) VALUES
('Brake Pads', 'Brake System', 50, 25.00),
('Engine Oil', 'Lubricant', 100, 10.00),
('Car Battery', 'Electrical', 20, 120.00);

-- =========================
-- SERVICE ORDER PARTS (Many-to-Many)
-- =========================
INSERT INTO service_order_parts (service_order_id, part_id, quantity, price) VALUES
(2, 1, 2, 50.00),
(1, 2, 3, 30.00),
(3, 3, 1, 120.00);