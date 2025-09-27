import apiRequest from './api';

// Admin Dashboard
export const adminAPI = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiRequest('/admin/dashboard', {
      method: 'GET',
    });
    return response.data;
  },

  // Guide Management
  getGuides: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/guides?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  createGuide: async (guideData) => {
    const response = await apiRequest('/api/guides', {
      method: 'POST',
      body: JSON.stringify(guideData),
    });
    return response.data;
  },

  updateGuide: async (guideId, guideData) => {
    const response = await apiRequest(`/api/guides/${guideId}`, {
      method: 'PUT',
      body: JSON.stringify(guideData),
    });
    return response.data;
  },

  deleteGuide: async (guideId) => {
    const response = await apiRequest(`/api/guides/${guideId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Student Management
  getStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/admin/students?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    return response.data;
  },

  getStudentsByDivisionId: async (divisionId) => {
    const response = await apiRequest(`/admin/students?divisionId=${divisionId}`, {
      method: 'GET',
    });
    return response.data;
  },

  // Group Management
  getGroups: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/groups?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  createGroup: async (groupData) => {
    const response = await apiRequest('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  updateGroup: async (groupId, groupData) => {
    const response = await apiRequest(`/api/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  deleteGroup: async (groupId) => {
    const response = await apiRequest(`/api/groups/${groupId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Project Management
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/admin/projects?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  // Evaluation Parameters
  getEvaluationParameters: async () => {
    const response = await apiRequest('/admin/evaluation-parameters', {
      method: 'GET',
    });
    return response.data;
  },

  updateEvaluationParameters: async (parameters) => {
    const response = await apiRequest('/admin/evaluation-parameters', {
      method: 'PUT',
      body: JSON.stringify({ parameters }),
    });
    return response.data;
  },

  // Division Management
  getDivisions: async () => {
    const response = await apiRequest('/admin/divisions', {
      method: 'GET',
    });
    return response.data;
  },

  createDivision: async (divisionData) => {
    const response = await apiRequest('/admin/divisions', {
      method: 'POST',
      body: JSON.stringify(divisionData),
    });
    return response.data;
  },

  // Enrollment Management
  getEnrollments: async (divisionId) => {
    const response = await apiRequest(`/admin/enrollments?divisionId=${divisionId}`, {
      method: 'GET',
    });
    return response.data;
  },

  createEnrollment: async (enrollmentData) => {
    const response = await apiRequest('/admin/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
    return response.data;
  },

  generateEnrollments: async (generateData) => {
    const response = await apiRequest('/admin/enrollments/generate', {
      method: 'POST',
      body: JSON.stringify(generateData),
    });
    return response.data;
  },

  deleteEnrollment: async (enrollmentId) => {
    const response = await apiRequest(`/admin/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  deleteAllEnrollments: async (divisionId) => {
    const response = await apiRequest(`/admin/enrollments?divisionId=${divisionId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Exam Schedule Management
  getExamSchedules: async () => {
    const response = await apiRequest('/admin/exam-schedules', {
      method: 'GET',
    });
    return response.data;
  },

  createExamSchedule: async (scheduleData) => {
    const response = await apiRequest('/admin/exam-schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
    return response.data;
  },

  // Reports & Analytics
  getReports: async (type, params = {}) => {
    const queryString = new URLSearchParams({ type, ...params }).toString();
    const response = await apiRequest(`/admin/reports?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },
}; 