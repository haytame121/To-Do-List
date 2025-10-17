const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem('token');
  }
  if (!res.ok) {
    const message = data?.message || 'Erreur réseau';
    throw new Error(message);
  }
  return data;
}

export const AuthAPI = {
  register(payload) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login({ username, password }) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  profile() {
    return request('/api/auth/profile', { method: 'GET' });
  },
  logout() {
    return request('/api/auth/logout', { method: 'POST' });
  },
};

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export const TodosAPI = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const q = query ? `?${query}` : '';
    return request(`/api/todos${q}`, { method: 'GET' });
  },
  create(payload) {
    return request('/api/todos', { method: 'POST', body: JSON.stringify(payload) });
  },
  toggle(id) {
    return request(`/api/todos/${id}/toggle`, { method: 'PATCH' });
  },
  remove(id) {
    return request(`/api/todos/${id}`, { method: 'DELETE' });
  },
};

export const AdminAPI = {
  stats() {
    return request('/api/admin/stats', { method: 'GET' });
  },
  users() {
    return request('/api/admin/users', { method: 'GET' });
  },
  updateUser(id, payload) {
    return request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
};


