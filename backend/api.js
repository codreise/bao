import { appParams } from './app-params';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = appParams.token;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, data);
    const error = new Error(data?.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => 
    request(endpoint, { method: 'GET', ...options }),

  post: (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  put: (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  delete: (endpoint, options = {}) =>
    request(endpoint, {
      method: 'DELETE',
      ...options,
    }),
};