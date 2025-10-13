import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/guide/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API requests (keeping for backward compatibility)
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Admin Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      data: credentials,
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
      data: userData,
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
      data: credentials,
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
      data: userData,
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
    const response = await apiRequest('/auth/guide/me', {
      method: 'GET',
    });
    
    return response.data;
  },

  // Update guide profile
  updateGuideProfile: async (profileData) => {
    const response = await apiRequest('/auth/guide/me', {
      method: 'PUT',
      data: profileData
    });
    
    return response.data;
  },

  // Change guide password
  changeGuidePassword: async (passwordData) => {
    const response = await apiRequest('/auth/guide/change-password', {
      method: 'PUT',
      data: passwordData
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
    data: data,
  }),
  updateGroup: (id, data) => apiRequest(`/groups/${id}`, {
    method: 'PUT',
    data: data,
  }),
  updateProjectDetails: (id, data) => apiRequest(`/groups/${id}/project`, {
    method: 'PUT',
    data: data,
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
    data: data,
  }),
  updateGuide: (id, data) => apiRequest(`/guides/${id}`, {
    method: 'PUT',
    data: data,
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
    data: data,
  }),
  updateProject: (id, data) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    data: data,
  }),
  deleteProject: (id) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Guide-specific API functions
export const guidePanelAPI = {
  // Guide Profile Management
  getGuideProfile: (guideId) => apiRequest(`/guides/${guideId}/profile`),
  updateGuideProfile: (guideId, data) => apiRequest(`/guides/${guideId}/profile`, {
    method: 'PUT',
    data: data,
  }),
  
  // Guide Dashboard Data
  getGuideDashboard: (guideId) => apiRequest(`/guides/${guideId}/dashboard`),
  getGuideStats: (guideId) => apiRequest(`/guides/${guideId}/stats`),
  
  // Guide's Students Management
  getGuideStudents: (guideId) => apiRequest(`/guides/${guideId}/students`),
  getStudentById: (guideId, studentId) => apiRequest(`/guides/${guideId}/students/${studentId}`),
  
  // Guide's Groups Management
  getGuideGroups: (guideId) => apiRequest(`/guides/${guideId}/groups`),
  getGroupById: (guideId, groupId) => apiRequest(`/guides/${guideId}/groups/${groupId}`),
  createGroup: (guideId, data) => apiRequest(`/guides/${guideId}/groups`, {
    method: 'POST',
    data: data,
  }),
  updateGroup: (guideId, groupId, data) => apiRequest(`/guides/${guideId}/groups/${groupId}`, {
    method: 'PUT',
    data: data,
  }),
  deleteGroup: (guideId, groupId) => apiRequest(`/guides/${guideId}/groups/${groupId}`, {
    method: 'DELETE',
  }),
  
  // Guide's Projects Management
  getGuideProjects: (guideId) => apiRequest(`/guides/${guideId}/projects`),
  getProjectById: (guideId, projectId) => apiRequest(`/guides/${guideId}/projects/${projectId}`),
  approveProject: (guideId, projectId, data) => apiRequest(`/guides/${guideId}/projects/${projectId}/approve`, {
    method: 'POST',
    data: data,
  }),
  rejectProject: (guideId, projectId, data) => apiRequest(`/guides/${guideId}/projects/${projectId}/reject`, {
    method: 'POST',
    data: data,
  }),
  
  // Guide's Feedback Management
  getGuideFeedback: (guideId) => apiRequest(`/guides/${guideId}/feedback`),
  getFeedbackById: (guideId, feedbackId) => apiRequest(`/guides/${guideId}/feedback/${feedbackId}`),
  createFeedback: (guideId, data) => apiRequest(`/guides/${guideId}/feedback`, {
    method: 'POST',
    data: data,
  }),
  updateFeedback: (guideId, feedbackId, data) => apiRequest(`/guides/${guideId}/feedback/${feedbackId}`, {
    method: 'PUT',
    data: data,
  }),
  deleteFeedback: (guideId, feedbackId) => apiRequest(`/guides/${guideId}/feedback/${feedbackId}`, {
    method: 'DELETE',
  }),
  
  // Guide's Evaluations
  getGuideEvaluations: (guideId) => apiRequest(`/guides/${guideId}/evaluations`),
  getEvaluationById: (guideId, evaluationId) => apiRequest(`/guides/${guideId}/evaluations/${evaluationId}`),
  createEvaluation: (guideId, data) => apiRequest(`/guides/${guideId}/evaluations`, {
    method: 'POST',
    data: data,
  }),
  updateEvaluation: (guideId, evaluationId, data) => apiRequest(`/guides/${guideId}/evaluations/${evaluationId}`, {
    method: 'PUT',
    data: data,
  }),
  
  // Guide's Announcements
  getGuideAnnouncements: (guideId) => apiRequest(`/guides/${guideId}/announcements`),
  getAnnouncementById: (guideId, announcementId) => apiRequest(`/guides/${guideId}/announcements/${announcementId}`),
  
  // Guide's Schedules/Meetings
  getGuideSchedules: (guideId) => apiRequest(`/guides/${guideId}/schedules`),
  getScheduleById: (guideId, scheduleId) => apiRequest(`/guides/${guideId}/schedules/${scheduleId}`),
  createSchedule: (guideId, data) => apiRequest(`/guides/${guideId}/schedules`, {
    method: 'POST',
    data: data,
  }),
  updateSchedule: (guideId, scheduleId, data) => apiRequest(`/guides/${guideId}/schedules/${scheduleId}`, {
    method: 'PUT',
    data: data,
  }),
  deleteSchedule: (guideId, scheduleId) => apiRequest(`/guides/${guideId}/schedules/${scheduleId}`, {
    method: 'DELETE',
  }),
};

// Export the axios instance for direct use if needed
export { apiClient };

export default apiRequest;
