const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || 'Request failed');
  }

  return body;
}

export const api = {
  getDashboard: () => request('/dashboard'),
  getCustomers: () => request('/customers'),
  addCustomer: (payload) => request('/customers', { method: 'POST', body: JSON.stringify(payload) }),
  getVehicles: () => request('/vehicles'),
  addVehicle: (payload) => request('/vehicles', { method: 'POST', body: JSON.stringify(payload) }),
  getServiceOrders: () => request('/service-orders'),
  addServiceOrder: (payload) => request('/service-orders', { method: 'POST', body: JSON.stringify(payload) }),
  updateServiceOrderStatus: (id, payload) =>
    request(`/service-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
};
