// API Service for HRMS Backend

const API_BASE_URL = 'http://localhost:8000';

export const getTenantSlugFromHost = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const host = window.location.hostname.toLowerCase();
  if (host.endsWith(".localhost")) {
    return host.slice(0, -".localhost".length);
  }

  const parts = host.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }

  return "";
};

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

  const token = localStorage.getItem('token');
  const tenantSlug = localStorage.getItem('tenant_slug') || getTenantSlugFromHost();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  if (tenantSlug && !config.headers["X-Tenant-Slug"]) {
    config.headers = {
      ...config.headers,
      "X-Tenant-Slug": tenantSlug,
    };
  }

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
  getMe: () => apiRequest('/employees/me'),
  getById: (id) => apiRequest(`/employees/${id}`),
  create: (data) => apiRequest('/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMe: (data) => apiRequest('/employees/me', {
    method: 'PUT',
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

export const attendanceAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/attendance/${queryString ? `?${queryString}` : ""}`);
  },
  getToday: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/attendance/today${queryString ? `?${queryString}` : ""}`);
  },
  checkIn: () =>
    apiRequest("/attendance/check-in", {
      method: "POST",
    }),
  lunchStart: () =>
    apiRequest("/attendance/lunch-start", {
      method: "POST",
    }),
  lunchEnd: () =>
    apiRequest("/attendance/lunch-end", {
      method: "POST",
    }),
  checkOut: () =>
    apiRequest("/attendance/check-out", {
      method: "POST",
    }),
};

export const optionsAPI = {
  getDepartments: () => apiRequest("/options/departments"),
  createDepartment: (data) =>
    apiRequest("/options/departments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getLeaveTypes: () => apiRequest("/options/leave-types"),
  getAllLeaveTypes: () => apiRequest("/options/leave-types?include_inactive=true"),
  createLeaveType: (data) =>
    apiRequest("/options/leave-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLeaveType: (id, data) =>
    apiRequest(`/options/leave-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLeaveType: (id) =>
    apiRequest(`/options/leave-types/${id}`, {
      method: "DELETE",
    }),
  getMyLeaveBalances: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/options/leave-balances/me${queryString ? `?${queryString}` : ""}`);
  },
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

export const payrollAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/payroll/${queryString ? '?' + queryString : ''}`);
  },
  getById: (id) => apiRequest(`/payroll/${id}`),
  create: (data) =>
    apiRequest("/payroll/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/payroll/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/payroll/${id}`, {
      method: "DELETE",
    }),
  getMonthlySummary: (month) => apiRequest(`/payroll/monthly/${month}`),
  generateBulk: (month) =>
    apiRequest(`/payroll/generate-bulk?month=${encodeURIComponent(month)}`, {
      method: "POST",
    }),
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
  login: async ({ companySlug, username, password }) => {
    const resolvedTenantSlug = companySlug || getTenantSlugFromHost();
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(resolvedTenantSlug ? { 'X-Tenant-Slug': resolvedTenantSlug } : {}),
      },
      body: new URLSearchParams({
        username,
        password,
      }).toString(),
    });
  },
};

export const companyAPI = {
  register: (data) =>
    apiRequest("/companies/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getCurrent: () => apiRequest("/companies/current"),
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
