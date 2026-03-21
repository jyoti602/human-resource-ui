// API Service for HRMS Backend

const API_BASE_URL = 'http://localhost:8000';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Handle FormData (for file uploads)
  const isFormData = options.isFormData;
  
  const config = {
    headers: isFormData ? {} : {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Remove isFormData from config before passing to fetch
  delete config.isFormData;

  // Temporarily disable authentication for testing
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Employee API functions
export const employeeAPI = {
  getAll: () => apiRequest('/employees/'),
  getById: (id) => apiRequest(`/employees/${id}`),
  create: (data) => apiRequest('/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// Leave Request API functions
export const leaveRequestAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/leave-requests/${queryString ? '?' + queryString : ''}`);
  },
  getAllForAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/leave-requests/all${queryString ? '?' + queryString : ''}`);
  },
  getById: (id) => apiRequest(`/leave-requests/${id}`),
  create: (data) => apiRequest('/leave-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/leave-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateStatus: (id, status, adminComment = '') => {
    const params = new URLSearchParams({ status });
    if (adminComment) params.append('admin_comment', adminComment);
    return apiRequest(`/leave-requests/update-status/${id}?${params.toString()}`, {
      method: 'PUT',
    });
  },
  delete: (id) => apiRequest(`/leave-requests/${id}`, {
    method: 'DELETE',
  }),
  getEmployeeRequests: (employeeId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/leave-requests/employee/${employeeId}${queryString ? '?' + queryString : ''}`);
  },
};

// Employee Registration API functions
export const employeeRegistrationAPI = {
  // Register new employee
  register: async (formData) => {
    return apiRequest('/employee-registrations/register', {
      method: 'POST',
      body: JSON.stringify(formData), // Send as JSON
    });
  },

  // Get all registrations (admin)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/employee-registrations/all${queryString ? '?' + queryString : ''}`);
  },

  // Get registration by ID (admin)
  getById: async (id) => {
    return apiRequest(`/employee-registrations/${id}`);
  },

  // Approve/reject registration (admin)
  approve: async (id, approvalData) => {
    return apiRequest(`/employee-registrations/approve/${id}`, {
      method: 'PUT',
      body: JSON.stringify(approvalData),
    });
  },

  // Delete registration (admin)
  delete: async (id) => {
    return apiRequest(`/employee-registrations/${id}`, {
      method: 'DELETE',
    });
  },

  // Get registration statistics (admin)
  getStats: async () => {
    return apiRequest('/employee-registrations/stats');
  },

  // Login with registration data
  login: async (email, password) => {
    return apiRequest('/employee-registrations/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Authentication API functions
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.detail || error.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};
