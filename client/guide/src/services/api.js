const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add Authorization header if token exists
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response. Please check if the backend server is running.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Admin Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Return the data in the format expected by the frontend
    return {
      token: response.data.token,
      data: response.data.data
    };
  },

  // Admin Register
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Return the data in the format expected by the frontend
    return {
      token: response.data.token,
      data: response.data.data
    };
  },

  // Guide Login
  guideLogin: async (credentials) => {
    const response = await apiRequest('/auth/guide/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Return the data in the format expected by the frontend
    return {
      token: response.data.token,
      data: response.data.data
    };
  },

  // Guide Register
  guideRegister: async (userData) => {
    const response = await apiRequest('/auth/guide/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Return the data in the format expected by the frontend
    return {
      token: response.data.token,
      data: response.data.data
    };
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current guide profile
  getGuideProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await apiRequest('/auth/guide/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  },

  // Update guide profile
  updateGuideProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await apiRequest('/auth/guide/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    return response.data;
  },

  // Change guide password
  changeGuidePassword: async (passwordData) => {
    const token = localStorage.getItem('token');
    const response = await apiRequest('/auth/guide/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });
    
    return response.data;
  }
};

export const groupAPI = {
  getAllGroups: () => apiRequest('/groups'),
  getGroupById: (id) => apiRequest(`/groups/${id}`),
  getGroupsByGuide: (guideId) => apiRequest(`/groups/guide/${guideId}`),
  createGroup: (data) => apiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGroup: (id, data) => apiRequest(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateProjectDetails: (id, data) => apiRequest(`/groups/${id}/project`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteGroup: (id) => apiRequest(`/groups/${id}`, {
    method: 'DELETE',
  }),
};

export const guideAPI = {
  getAllGuides: () => apiRequest('/guides'),
  getGuideById: (id) => apiRequest(`/guides/${id}`),
  createGuide: (data) => apiRequest('/guides', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGuide: (id, data) => apiRequest(`/guides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteGuide: (id) => apiRequest(`/guides/${id}`, {
    method: 'DELETE',
  }),
};

export const projectAPI = {
  getAllProjects: () => apiRequest('/projects'),
  getProjectById: (id) => apiRequest(`/projects/${id}`),
  createProject: (data) => apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProject: (id, data) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProject: (id) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

export default apiRequest;
