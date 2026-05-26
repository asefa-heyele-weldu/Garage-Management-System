USE garage_management;

INSERT INTO customers (name, phone, email, notes) VALUES
('Amina Motors', '555-0191', 'aminamotors@example.com', 'Fleet account'),
('Bright Ride Logistics', '555-0144', 'ops@brightride.example', 'Priority repairs');

INSERT INTO vehicles (customer_id, plate_number, make, model, year, vin, status) VALUES
(1, 'KAA-101A', 'Toyota', 'Hiace', 2019, 'VIN-TOY-001', 'Waiting'),
(2, 'KBB-220B', 'Isuzu', 'NPR', 2021, 'VIN-ISU-002', 'In Service');

INSERT INTO service_orders (vehicle_id, service_type, description, status, priority, estimated_cost, actual_cost, opened_at, closed_at) VALUES
(1, 'Oil Change', 'Routine maintenance and inspection', 'Open', 'Normal', 45.00, NULL, NOW(), NULL),
(2, 'Brake Repair', 'Replace pads and inspect rotors', 'In Progress', 'High', 220.00, NULL, NOW(), NULL);
