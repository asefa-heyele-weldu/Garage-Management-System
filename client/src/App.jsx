import { useEffect, useMemo, useState } from 'react';
import { api } from './api/client';

const emptyCustomer = {
  name: '',
  phone: '',
  email: '',
  notes: ''
};

const emptyVehicle = {
  customerId: '',
  plateNumber: '',
  make: '',
  model: '',
  year: '',
  vin: '',
  status: 'Waiting'
};

const emptyOrder = {
  vehicleId: '',
  serviceType: '',
  description: '',
  status: 'Open',
  priority: 'Normal',
  estimatedCost: '',
  actualCost: ''
};

function Metric({ label, value, tone }) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function DataTable({ title, columns, rows, emptyText }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{title}</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyText}</td>
              </tr>
            ) : (
              rows.map((row) => row)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, customerData, vehicleData, orderData] = await Promise.all([
        api.getDashboard(),
        api.getCustomers(),
        api.getVehicles(),
        api.getServiceOrders()
      ]);

      setDashboard(dashboardData);
      setCustomers(customerData);
      setVehicles(vehicleData);
      setServiceOrders(orderData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const customerOptions = useMemo(
    () => customers.map((customer) => ({ value: customer.id, label: customer.name })),
    [customers]
  );

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: vehicle.id,
        label: `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}`
      })),
    [vehicles]
  );

  async function handleCustomerSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await api.addCustomer(customerForm);
      setCustomerForm(emptyCustomer);
      setMessage('Customer added successfully.');
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await api.addVehicle({
        ...vehicleForm,
        customerId: Number(vehicleForm.customerId),
        year: vehicleForm.year ? Number(vehicleForm.year) : null
      });
      setVehicleForm(emptyVehicle);
      setMessage('Vehicle added successfully.');
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await api.addServiceOrder({
        ...orderForm,
        vehicleId: Number(orderForm.vehicleId),
        estimatedCost: orderForm.estimatedCost ? Number(orderForm.estimatedCost) : null,
        actualCost: orderForm.actualCost ? Number(orderForm.actualCost) : null
      });
      setOrderForm(emptyOrder);
      setMessage('Service order created successfully.');
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id, status) {
    setError('');
    setMessage('');
    try {
      await api.updateServiceOrderStatus(id, { status });
      setMessage('Service order status updated.');
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  const summary = dashboard?.summary || { customers: 0, vehicles: 0, jobs: 0, activeJobs: 0 };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">Garage Management System</p>
            <h1>Control customers, vehicles, and service flow from one clean dashboard.</h1>
            <p className="hero-copy">
              Track jobs, add incoming vehicles, and keep every bay moving with a MySQL-backed
              operations board.
            </p>
          </div>
          <div className="hero-panel">
            <div>
              <span>System state</span>
              <strong>{loading ? 'Refreshing' : 'Live'}</strong>
            </div>
            <div>
              <span>API endpoint</span>
              <strong>Express + MySQL</strong>
            </div>
          </div>
        </section>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {message ? <div className="alert alert-success">{message}</div> : null}

        <section className="metrics-grid">
          <Metric label="Customers" value={summary.customers} tone="gold" />
          <Metric label="Vehicles" value={summary.vehicles} tone="blue" />
          <Metric label="Service Orders" value={summary.jobs} tone="green" />
          <Metric label="Active Jobs" value={summary.activeJobs} tone="red" />
        </section>

        <section className="content-grid">
          <section className="panel">
            <div className="panel-heading">
              <h2>Add Customer</h2>
            </div>
            <form className="stack-form" onSubmit={handleCustomerSubmit}>
              <input
                placeholder="Customer name"
                value={customerForm.name}
                onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })}
              />
              <div className="two-col">
                <input
                  placeholder="Phone"
                  value={customerForm.phone}
                  onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })}
                />
                <input
                  placeholder="Email"
                  value={customerForm.email}
                  onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })}
                />
              </div>
              <textarea
                placeholder="Notes"
                value={customerForm.notes}
                onChange={(event) => setCustomerForm({ ...customerForm, notes: event.target.value })}
              />
              <button type="submit" disabled={submitting}>
                Save Customer
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Add Vehicle</h2>
            </div>
            <form className="stack-form" onSubmit={handleVehicleSubmit}>
              <select
                value={vehicleForm.customerId}
                onChange={(event) => setVehicleForm({ ...vehicleForm, customerId: event.target.value })}
              >
                <option value="">Select customer</option>
                {customerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="two-col">
                <input
                  placeholder="Plate number"
                  value={vehicleForm.plateNumber}
                  onChange={(event) =>
                    setVehicleForm({ ...vehicleForm, plateNumber: event.target.value })
                  }
                />
                <input
                  placeholder="Year"
                  value={vehicleForm.year}
                  onChange={(event) => setVehicleForm({ ...vehicleForm, year: event.target.value })}
                />
              </div>
              <div className="two-col">
                <input
                  placeholder="Make"
                  value={vehicleForm.make}
                  onChange={(event) => setVehicleForm({ ...vehicleForm, make: event.target.value })}
                />
                <input
                  placeholder="Model"
                  value={vehicleForm.model}
                  onChange={(event) => setVehicleForm({ ...vehicleForm, model: event.target.value })}
                />
              </div>
              <input
                placeholder="VIN"
                value={vehicleForm.vin}
                onChange={(event) => setVehicleForm({ ...vehicleForm, vin: event.target.value })}
              />
              <button type="submit" disabled={submitting}>
                Save Vehicle
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Create Service Order</h2>
            </div>
            <form className="stack-form" onSubmit={handleOrderSubmit}>
              <select
                value={orderForm.vehicleId}
                onChange={(event) => setOrderForm({ ...orderForm, vehicleId: event.target.value })}
              >
                <option value="">Select vehicle</option>
                {vehicleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                placeholder="Service type"
                value={orderForm.serviceType}
                onChange={(event) => setOrderForm({ ...orderForm, serviceType: event.target.value })}
              />
              <textarea
                placeholder="Description"
                value={orderForm.description}
                onChange={(event) =>
                  setOrderForm({ ...orderForm, description: event.target.value })
                }
              />
              <div className="two-col">
                <select
                  value={orderForm.priority}
                  onChange={(event) => setOrderForm({ ...orderForm, priority: event.target.value })}
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
                <select
                  value={orderForm.status}
                  onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value })}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="two-col">
                <input
                  placeholder="Estimated cost"
                  value={orderForm.estimatedCost}
                  onChange={(event) =>
                    setOrderForm({ ...orderForm, estimatedCost: event.target.value })
                  }
                />
                <input
                  placeholder="Actual cost"
                  value={orderForm.actualCost}
                  onChange={(event) => setOrderForm({ ...orderForm, actualCost: event.target.value })}
                />
              </div>
              <button type="submit" disabled={submitting}>
                Save Service Order
              </button>
            </form>
          </section>
        </section>

        <section className="content-grid content-grid-wide">
          <DataTable
            title="Recent Service Orders"
            columns={['Job', 'Vehicle', 'Customer', 'Status', 'Priority', 'Action']}
            emptyText="No service orders found."
            rows={serviceOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.serviceType}</strong>
                  <div className="subtle">#{order.id}</div>
                </td>
                <td>
                  {order.plateNumber}
                  <div className="subtle">
                    {order.make} {order.model}
                  </div>
                </td>
                <td>{order.customerName}</td>
                <td>
                  <Badge tone={order.status === 'Completed' ? 'green' : order.status === 'In Progress' ? 'blue' : 'gold'}>
                    {order.status}
                  </Badge>
                </td>
                <td>{order.priority}</td>
                <td>
                  <div className="inline-actions">
                    <button type="button" className="ghost" onClick={() => updateStatus(order.id, 'In Progress')}>
                      Progress
                    </button>
                    <button type="button" className="ghost" onClick={() => updateStatus(order.id, 'Completed')}>
                      Complete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          />

          <DataTable
            title="Customers"
            columns={['Name', 'Phone', 'Email', 'Notes']}
            emptyText="No customers found."
            rows={customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone || '—'}</td>
                <td>{customer.email || '—'}</td>
                <td>{customer.notes || '—'}</td>
              </tr>
            ))}
          />
        </section>

        <section className="content-grid content-grid-wide">
          <DataTable
            title="Vehicles"
            columns={['Plate', 'Vehicle', 'Customer', 'Status']}
            emptyText="No vehicles found."
            rows={vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.plateNumber}</td>
                <td>
                  {vehicle.make} {vehicle.model}
                  <div className="subtle">{vehicle.year || 'Year unknown'}</div>
                </td>
                <td>{vehicle.customerName}</td>
                <td>{vehicle.status}</td>
              </tr>
            ))}
          />
        </section>
      </main>
    </div>
  );
}
