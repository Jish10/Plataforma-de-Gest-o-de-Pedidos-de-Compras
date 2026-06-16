const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const mensagem = data.mensagem || 'Ocorreu um erro ao comunicar com a API.';
    const detalhes = data.erros ? ` ${data.erros.join(' ')}` : '';
    throw new Error(`${mensagem}${detalhes}`);
  }

  return data;
}

export async function login(email, senha) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });
}

export async function getPurchaseOrders() {
  return request('/purchase-orders');
}


export async function getPurchaseOrder(id) {
  return request(`/purchase-orders/${id}`);
}

export async function createPurchaseOrder(order) {
  return request('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });
}

export async function updatePurchaseOrder(id, order) {
  return request(`/purchase-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order)
  });
}

export async function deletePurchaseOrder(id) {
  return request(`/purchase-orders/${id}`, {
    method: 'DELETE'
  });
}

export async function getUsers() {
  return request('/users');
}

export async function getSuppliers() {
  return request('/suppliers');
}

export async function getProducts() {
  return request('/products');
}
