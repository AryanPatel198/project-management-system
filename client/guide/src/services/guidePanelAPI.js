import apiRequest from './api';

// Guide Panel API
export const guidePanelAPI = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiRequest('/guide-panel/dashboard', {
      method: 'GET',
    });
    return response.data;
  },

  // Group Management
  getGroups: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/groups?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} groupId - The ID of the group
   * @returns {Promise<object>} Group details
   */
  getGroupDetails: async (groupId) => {
    const response = await apiRequest(`/guide-panel/groups/${groupId}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} groupId - The ID of the group
   * @param {object} groupData - The group data to update
   * @returns {Promise<object>} Updated group
   */
  updateGroup: async (groupId, groupData) => {
    const response = await apiRequest(`/guide-panel/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  /**
   * @param {string} groupId - The ID of the group
   * @param {object} groupData - The group details to update
   * @returns {Promise<object>} Updated group details
   */
  updateGroupDetails: async (groupId, groupData) => {
    const response = await apiRequest(`/guide-panel/groups/${groupId}/details`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  // Student Management
  getStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/students?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} enrollment - Enrollment number to search
   * @returns {Promise<object[]>} Search results
   */
  searchStudents: async (enrollment) => {
    const response = await apiRequest(`/guide-panel/students/search?enrollment=${encodeURIComponent(enrollment)}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} studentId - The ID of the student
   * @returns {Promise<object>} Student details
   */
  getStudentDetails: async (studentId) => {
    const response = await apiRequest(`/guide-panel/students/${studentId}`, {
      method: 'GET',
    });
    return response.data;
  },

  // Project Management
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/projects?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} projectId - The ID of the project
   * @returns {Promise<object>} Project details
   */
  getProjectDetails: async (projectId) => {
    const response = await apiRequest(`/guide-panel/projects/${projectId}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} projectId - The ID of the project
   * @param {object} evaluationData - Evaluation data
   * @returns {Promise<object>} Evaluation result
   */
  evaluateProject: async (projectId, evaluationData) => {
    const response = await apiRequest(`/guide-panel/projects/${projectId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify(evaluationData),
    });
    return response.data;
  },

  // Project Approval
  getProjectApprovals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/project-approvals?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {string} projectId - The ID of the project
   * @param {object} approvalData - Approval data
   * @returns {Promise<object>} Updated approval
   */
  updateProjectApproval: async (projectId, approvalData) => {
    const response = await apiRequest(`/guide-panel/project-approvals/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(approvalData),
    });
    return response.data;
  },

  // Feedback System
  getFeedback: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/feedback?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {object} feedbackData - Feedback data
   * @returns {Promise<object>} Submitted feedback
   */
  submitFeedback: async (feedbackData) => {
    const response = await apiRequest('/guide-panel/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
    return response.data;
  },

  // Seminar Schedule
  getSeminarSchedule: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/seminar-schedule?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {object} seminarData - Seminar data
   * @returns {Promise<object>} Scheduled seminar
   */
  scheduleSeminar: async (seminarData) => {
    const response = await apiRequest('/guide-panel/seminar-schedule', {
      method: 'POST',
      body: JSON.stringify(seminarData),
    });
    return response.data;
  },

  // Communication
  getCommunication: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiRequest(`/guide-panel/communication?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {object} messageData - Message data
   * @returns {Promise<object>} Sent message
   */
  sendMessage: async (messageData) => {
    const response = await apiRequest('/guide-panel/communication', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.data;
  },

  // Reports & Analytics
  /**
   * @param {string} type - Report type
   * @param {object} [params={}] - Additional parameters
   * @returns {Promise<object>} Report data
   */
  getReports: async (type, params = {}) => {
    const queryString = new URLSearchParams({ type, ...params }).toString();
    const response = await apiRequest(`/guide-panel/reports?${queryString}`, {
      method: 'GET',
    });
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await apiRequest('/guide-panel/profile', {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * @param {object} profileData - Profile data to update
   * @returns {Promise<object>} Updated profile
   */
  updateProfile: async (profileData) => {
    const response = await apiRequest('/guide-panel/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },
}; 