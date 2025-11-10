// src/renderer/utils/api.ts

const API_URL = 'http://185.170.198.120/api';

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const getCurrentAccountId = (): string | null => {
  return localStorage.getItem('sf_current_account_id');
};

export const api = {
  // GET request
  get: async (endpoint: string) => {
    const token = getToken();
    const accountId = getCurrentAccountId();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (accountId) {
      headers['x-account-id'] = accountId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  // POST request
  post: async (endpoint: string, data: any) => {
    const token = getToken();
    const accountId = getCurrentAccountId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (accountId) {
      headers['x-account-id'] = accountId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // PUT request
  put: async (endpoint: string, data: any) => {
    const token = getToken();
    const accountId = getCurrentAccountId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (accountId) {
      headers['x-account-id'] = accountId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // PATCH request
  patch: async (endpoint: string, data: any) => {
    const token = getToken();
    const accountId = getCurrentAccountId();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (accountId) {
      headers['x-account-id'] = accountId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // DELETE request
  delete: async (endpoint: string) => {
    const token = getToken();
    const accountId = getCurrentAccountId();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (accountId) {
      headers['x-account-id'] = accountId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 204 No Content returns empty body
    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
};

export default api;

