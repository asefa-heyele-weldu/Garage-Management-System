import { query } from '../config/db.js';

export async function getDashboardSummary() {
  const [summaryRows, openJobsRows, recentCustomersRows] = await Promise.all([
    query(
      `SELECT
        (SELECT COUNT(*) FROM customers) AS customers,
        (SELECT COUNT(*) FROM vehicles) AS vehicles,
        (SELECT COUNT(*) FROM service_orders) AS jobs,
        (SELECT COUNT(*) FROM service_orders WHERE status IN ('Open', 'In Progress')) AS activeJobs`
    ),
    query(
      `SELECT
        so.id,
        so.service_type AS serviceType,
        so.status,
        so.priority,
        so.created_at AS createdAt,
        v.plate_number AS plateNumber,
        v.make,
        v.model,
        c.name AS customerName
      FROM service_orders so
      JOIN vehicles v ON v.id = so.vehicle_id
      JOIN customers c ON c.id = v.customer_id
      ORDER BY so.created_at DESC
      LIMIT 6`
    ),
    query(
      `SELECT id, name, phone, email, created_at AS createdAt
       FROM customers
       ORDER BY created_at DESC
       LIMIT 5`
    )
  ]);

  return {
    summary: summaryRows[0] || { customers: 0, vehicles: 0, jobs: 0, activeJobs: 0 },
    openJobs: openJobsRows,
    recentCustomers: recentCustomersRows
  };
}

export async function listCustomers() {
  return query(
    `SELECT id, name, phone, email, notes, created_at AS createdAt
     FROM customers
     ORDER BY created_at DESC`
  );
}

export async function createCustomer(input) {
  const result = await query(
    `INSERT INTO customers (name, phone, email, notes)
     VALUES (?, ?, ?, ?)`,
    [input.name, input.phone || null, input.email || null, input.notes || null]
  );

  return result.insertId;
}

export async function listVehicles() {
  return query(
    `SELECT
      v.id,
      v.customer_id AS customerId,
      v.plate_number AS plateNumber,
      v.make,
      v.model,
      v.year,
      v.vin,
      v.status,
      v.created_at AS createdAt,
      c.name AS customerName
     FROM vehicles v
     JOIN customers c ON c.id = v.customer_id
     ORDER BY v.created_at DESC`
  );
}

export async function createVehicle(input) {
  const result = await query(
    `INSERT INTO vehicles (customer_id, plate_number, make, model, year, vin, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.customerId,
      input.plateNumber,
      input.make,
      input.model,
      input.year || null,
      input.vin || null,
      input.status || 'Waiting'
    ]
  );

  return result.insertId;
}

export async function listServiceOrders() {
  return query(
    `SELECT
      so.id,
      so.vehicle_id AS vehicleId,
      so.service_type AS serviceType,
      so.description,
      so.status,
      so.priority,
      so.estimated_cost AS estimatedCost,
      so.actual_cost AS actualCost,
      so.opened_at AS openedAt,
      so.closed_at AS closedAt,
      v.plate_number AS plateNumber,
      v.make,
      v.model,
      c.name AS customerName
     FROM service_orders so
     JOIN vehicles v ON v.id = so.vehicle_id
     JOIN customers c ON c.id = v.customer_id
     ORDER BY so.opened_at DESC`
  );
}

export async function createServiceOrder(input) {
  const result = await query(
    `INSERT INTO service_orders
      (vehicle_id, service_type, description, status, priority, estimated_cost, actual_cost, opened_at, closed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [
      input.vehicleId,
      input.serviceType,
      input.description || null,
      input.status || 'Open',
      input.priority || 'Normal',
      input.estimatedCost || null,
      input.actualCost || null,
      input.status === 'Completed' ? new Date() : null
    ]
  );

  return result.insertId;
}

export async function updateServiceOrderStatus(id, status) {
  const closedAt = status === 'Completed' ? 'NOW()' : 'NULL';

  await query(
    `UPDATE service_orders
     SET status = ?, closed_at = ${closedAt}
     WHERE id = ?`,
    [status, id]
  );
}
