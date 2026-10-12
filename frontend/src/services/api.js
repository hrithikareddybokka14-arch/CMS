import axios from 'axios';

// Get base URL from Vite environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to standardize error messages and format
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMsg = 'An unexpected network error occurred.';
    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (data.validationErrors && typeof data.validationErrors === 'object') {
          const fieldMsgs = Object.entries(data.validationErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          errorMsg = data.message ? `${data.message} (${fieldMsgs})` : fieldMsgs;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        } else {
          errorMsg = `Server error (${error.response.status}): ${error.response.statusText}`;
        }
      } else {
        errorMsg = `Server error (${error.response.status}): ${error.response.statusText}`;
      }
    } else if (error.request) {
      errorMsg = 'Cannot connect to backend server. Please check if Spring Boot is running on port 8080.';
    } else if (error.message) {
      errorMsg = error.message;
    }
    return Promise.reject(new Error(errorMsg));
  }
);

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      return apiClient.post('/auth/login', credentials);
    },
    register: async (userData) => {
      return apiClient.post('/auth/register', userData);
    },
    logout: async () => {
      return { success: true };
    },
  },

  // Dashboard Overview
  dashboard: {
    getStats: async () => {
      return apiClient.get('/dashboard/stats');
    },
  },

  // Students
  students: {
    getAll: async (params = {}) => {
      const queryParams = {};
      if (params.search) queryParams.search = params.search;
      if (params.department && params.department !== 'All') queryParams.department = params.department;
      if (params.year && params.year !== 'All') queryParams.year = params.year;

      return apiClient.get('/students', { params: queryParams });
    },
    getById: async (id) => {
      return apiClient.get(`/students/${id}`);
    },
    getByStudentId: async (studentId) => {
      return apiClient.get(`/students/by-student-id/${studentId}`);
    },
    create: async (student) => {
      return apiClient.post('/students', student);
    },
    update: async (id, student) => {
      return apiClient.put(`/students/${id}`, student);
    },
    delete: async (id) => {
      return apiClient.delete(`/students/${id}`);
    },
  },

  // Faculty
  faculty: {
    getAll: async (params = {}) => {
      const queryParams = {};
      if (params.search) queryParams.search = params.search;
      if (params.department && params.department !== 'All') queryParams.department = params.department;

      return apiClient.get('/faculty', { params: queryParams });
    },
    getById: async (id) => {
      return apiClient.get(`/faculty/${id}`);
    },
    create: async (facultyMember) => {
      return apiClient.post('/faculty', facultyMember);
    },
    update: async (id, facultyMember) => {
      return apiClient.put(`/faculty/${id}`, facultyMember);
    },
    delete: async (id) => {
      return apiClient.delete(`/faculty/${id}`);
    },
  },

  // Courses & Departments
  courses: {
    getAll: async (params = {}) => {
      const queryParams = {};
      if (params.department && params.department !== 'All') queryParams.department = params.department;
      return apiClient.get('/courses', { params: queryParams });
    },
    create: async (course) => {
      return apiClient.post('/courses', course);
    },
    update: async (id, course) => {
      return apiClient.put(`/courses/${id}`, course);
    },
    delete: async (id) => {
      return apiClient.delete(`/courses/${id}`);
    },
  },

  // Attendance
  attendance: {
    getByDate: async (date, courseCode = '') => {
      const params = { date };
      if (courseCode) params.courseCode = courseCode;
      return apiClient.get('/attendance', { params });
    },
    recordBatch: async (records) => {
      return apiClient.post('/attendance/batch', records);
    },
    getByStudent: async (studentId) => {
      return apiClient.get(`/attendance/student/${studentId}`);
    },
  },

  // Marks & Grades
  marks: {
    getAll: async (params = {}) => {
      const queryParams = {};
      if (params.courseCode) queryParams.courseCode = params.courseCode;
      if (params.examType) queryParams.examType = params.examType;
      if (params.studentId) queryParams.studentId = params.studentId;
      return apiClient.get('/marks', { params: queryParams });
    },
    save: async (mark) => {
      return apiClient.post('/marks', mark);
    },
    saveBatch: async (marksList) => {
      return apiClient.post('/marks/batch', marksList);
    },
    getByStudent: async (studentId) => {
      return apiClient.get(`/marks/student/${studentId}`);
    },
  },
};

export default api;
