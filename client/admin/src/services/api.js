import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin",
});

// ✅ Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Consistent token key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (payload) => {
    const { data } = await api.post("/login", payload);
    // backend should return: { token, data: { ...admin } }
    // ✅ Save token for later requests
    localStorage.setItem("token", data.token);
    return data;
  },
};

// ✅ Guides API
export const guideAPI = {
  getAll: () => api.get("/get-all-guides"),
  getActive: () => api.get("/guides/active"), // Added for GroupManagement
  add: (payload) => api.post("/add-guide", payload),
  update: (id, payload) => api.patch(`/guides/${id}`, payload),
  delete: (id) => api.delete(`/guides/${id}`),
  updateStatus: (id, status) =>
    api.patch(`/new-guide-status/${id}`, { status }),
};

// ✅ Groups API
export const groupAPI = {
  getAll: (params) => api.get("/groups", { params }), // Supports course and year filters
  getById: (id) => api.get(`/groups/${id}`),
  getAvailableStudents: (id, params) =>
    api.get(`/groups/${id}/students/available`, { params }),
  create: (payload) => api.post("/groups", payload),
  update: (id, payload) => api.put(`/groups/${id}`, payload),
  delete: (id) => api.delete(`/groups/${id}`),
};

// ✅ Students API
export const studentAPI = {
  getAll: () => api.get("/students"),
  getAvailable: (params) => api.get("/students/available", { params }),
};

// ✅ Divisions API
export const divisionAPI = {
  getAll: (params) => api.get("/divisions", { params }),
  create: (payload) => api.post("/divisions", payload),
  updateStatus: (id) => api.patch(`/divisions/${id}/status`),
  delete: (id) => api.delete(`/divisions/${id}`),
};

// ✅ Enrollments API
export const enrollmentAPI = {
  getAll: () => api.get("/enrollments"),
  getByDivision: (divisionId) => api.get(`/enrollments/division/${divisionId}`),
  create: (payload) => api.post("/enrollments", payload),
  generate: (payload) => api.post("/enrollments/generate", payload),
  delete: (id) => api.delete(`/enrollments/${id}`),
  deleteAllByDivision: (divisionId) =>
    api.delete(`/enrollments/division/${divisionId}`),
};

// ✅ Evaluation Parameters API
export const evaluationParameterAPI = {
  getAll: () => api.get("/evaluation-parameters"),
  create: (payload) => api.post("/evaluation-parameters", payload),
  update: (id, payload) => api.put(`/evaluation-parameters/${id}`, payload),
  delete: (id) => api.delete(`/evaluation-parameters/${id}`),
};

// ✅ Admin API
export const adminAPI = {
  getProfile: () => api.get("/admin/profile"),
  updateProfile: (payload) => api.put("/admin/profile", payload),
  changePassword: (payload) => api.post("/admin/change-password", payload),
};

// ✅ Exam Schedules API
export const examScheduleAPI = {
  getAll: (params) => api.get("/exam-schedules", { params }),
  create: (payload) => api.post("/exam-schedules", payload),
  update: (id, payload) => api.put(`/exam-schedules/${id}`, payload),
  delete: (id) => api.delete(`/exam-schedules/${id}`),
};

// ✅ Course Announcements API
export const courseAnnouncementAPI = {
  getAll: () => api.get("/course-announcements"),
  create: (payload) => api.post("/course-announcements", payload),
  update: (id, payload) => api.put(`/course-announcements/${id}`, payload),
  delete: (id) => api.delete(`/course-announcements/${id}`),
};

// ✅ Project Evaluations API
export const projectEvaluationAPI = {
  getAll: () => api.get("/project-evaluations"),
  getByProject: (projectId) => api.get(`/project-evaluations/${projectId}`),
  update: (projectId, parameterId, payload) =>
    api.put(`/project-evaluations/${projectId}/${parameterId}`, payload),
};

// ✅ Guide Announcements API
export const guideAnnouncementAPI = {
  getAll: () => api.get("/guide-announcements"),
  create: (payload) => api.post("/guide-announcements", payload),
  update: (id, payload) => api.put(`/guide-announcements/${id}`, payload),
  delete: (id) => api.delete(`/guide-announcements/${id}`),
};

export default api;
