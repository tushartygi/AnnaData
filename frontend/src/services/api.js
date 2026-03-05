// API Base URL
const API_BASE_URL = 'https://annadata-me42.onrender.com/api';
//const API_BASE_URL = 'http://localhost:5000/api';


// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Handle API errors
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ============= AUTH APIs =============

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ============= CROP APIs =============

export const cropAPI = {
  // Get all crops with optional filters
  getAllCrops: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.state) queryParams.append('state', filters.state);
    
    const url = `${API_BASE_URL}/crops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get single crop
  getCrop: async (cropId) => {
    const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get crops by farmer
  getFarmerCrops: async (farmerId) => {
    const response = await fetch(`${API_BASE_URL}/crops/farmer/${farmerId}`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Create crop (farmer only)
  createCrop: async (cropData) => {
    const response = await fetch(`${API_BASE_URL}/crops`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData)
    });
    
    return await handleResponse(response);
  },

  // Update crop (farmer only)
  updateCrop: async (cropId, cropData) => {
    const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData)
    });
    
    return await handleResponse(response);
  },

  // Delete crop (farmer only)
  deleteCrop: async (cropId) => {
    const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  }
};

// ============= ORDER APIs =============

export const orderAPI = {
  // Get all orders for logged-in user
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Create order (customer only)
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    
    return await handleResponse(response);
  },

  // Update order status (farmer only)
  updateOrderStatus: async (orderId, status, note = '') => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    
    return await handleResponse(response);
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentStatus })
    });
    
    return await handleResponse(response);
  },

  // Cancel order (customer only)
  cancelOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  }
};

// ============= CART APIs =============

export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Add item to cart
  addToCart: async (cropId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cropId, quantity })
    });
    
    return await handleResponse(response);
  },

  // Update cart item quantity
  updateCartItem: async (cropId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${cropId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    
    return await handleResponse(response);
  },

  // Remove item from cart
  removeFromCart: async (cropId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${cropId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Helper to get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
