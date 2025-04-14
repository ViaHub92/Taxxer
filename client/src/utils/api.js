const API_URL = import.meta.env.PROD 
  ? 'http://18.221.245.7:5050'  // Your production API endpoint
  : 'http://localhost:5050';       // Development endpoint

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const deleteSpending = async (id) => {
  try {
    const response = await api(`/spending/${id}`, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    throw new Error('Failed to delete spending');
  }
};

export const deleteIncome = async (id) => {
  try {
    const response = await api(`/income/${id}`, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    throw new Error('Failed to delete income');
  }
};