// @ts-nocheck
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

const studentAPI = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register function
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Get student profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Get projects
  getProjects: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/projects`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  },

  // Submit project
  submitProject: async (projectData) => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      return await response.json();
    } catch (error) {
      console.error('Submit project error:', error);
      throw error;
    }
  },

  // Get group members
  getGroupMembers: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/group`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get group members error:', error);
      throw error;
    }
  },

  // Get feedback
  getFeedback: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/feedback`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get feedback error:', error);
      throw error;
    }
  },

  // Get announcements
  getAnnouncements: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/announcements`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get announcements error:', error);
      throw error;
    }
  },

  // Get exam schedules
  getExamSchedules: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/exam-schedules`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get exam schedules error:', error);
      throw error;
    }
  },

  // Get guide details
  getGuideDetails: async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`${API_BASE_URL}/student/guide`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get guide details error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
  },
};

export default studentAPI;
