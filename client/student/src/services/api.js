const API_BASE_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const studentPublicAPI = {
  getDivisions: () => apiRequest('/student/divisions'),
  getPendingEnrollments: (divisionId) => apiRequest(`/student/pending-enrollments?divisionId=${divisionId}`),
  register: (payload) => apiRequest('/student/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/student/login', { method: 'POST', body: JSON.stringify(payload) }),
};

export const studentProtectedAPI = {
  getProfile: () => {
    const token = localStorage.getItem('studentToken');
    return apiRequest('/student/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  getAvailableStudents: () => {
    const token = localStorage.getItem('studentToken');
    return apiRequest('/student/available-students', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  createGroup: (payload) => {
    const token = localStorage.getItem('studentToken');
    return apiRequest('/student/create-group', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  checkGroup: () => {
    const token = localStorage.getItem('studentToken');
    return apiRequest('/student/check-group', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export default apiRequest;
