import axios from 'axios';

// Use env var if set, otherwise use Vite proxy (empty base = same origin, proxied by vite)
const configuredBaseURL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const pageHostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalPage = ['localhost', '127.0.0.1', '::1'].includes(pageHostname);
const configuredLocalAPI = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBaseURL);

const remoteProductionPage = import.meta.env.PROD && !isLocalPage;

export const apiConfigError =
  remoteProductionPage && !configuredBaseURL
    ? 'Frontend is deployed without VITE_API_BASE_URL. Set it to your Render backend URL in Netlify and do redeploy.'
    : remoteProductionPage && configuredLocalAPI
      ? `Frontend is deployed with VITE_API_BASE_URL=${configuredBaseURL}. Set VITE_API_BASE_URL to your Render backend URL in Netlify and redeploy.`
      : '';

// In local dev: use configuredBaseURL (http://localhost:5000) so axios hits backend directly.
// Vite proxy is a fallback if baseURL is empty.
export const apiBaseURL = apiConfigError
  ? ''
  : configuredBaseURL || (isLocalPage ? 'http://localhost:5000' : '');

export const apiBaseURLDisplay = configuredBaseURL || apiBaseURL || 'backend URL';

const effectiveBaseURL = apiBaseURL;

const API = axios.create({
  baseURL: effectiveBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
API.interceptors.request.use((config) => {
  if (apiConfigError) {
    const error = new Error(apiConfigError);
    error.isApiConfigError = true;
    return Promise.reject(error);
  }

  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    if (typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type');
    } else {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
/** Admin / teacher / student login */
export const login = (identifier, password) =>
  API.post('/api/auth/login', { name: identifier, password });

// Student / teacher registration
export const registerStudent = (payload) =>
  API.post('/api/auth/register', payload);

// ── Profile / Dashboard ───────────────────────────────────────────────────────
export const getProfile = () => API.get('/api/students/profile');
export const getDashboard = () => API.get('/api/students/dashboard');

// ── Admin – Students ──────────────────────────────────────────────────────────
export const getAllStudents = (q = '') =>
  API.get('/api/students', { params: q ? { q } : {} });

export const addStudent = (payload) =>
  API.post('/api/students', payload);

export const editStudent = (id, payload) =>
  API.put(`/api/students/${id}`, payload);

export const deleteStudent = (id) =>
  API.delete(`/api/students/${id}`);

export const getStudentStats = () =>
  API.get('/api/students/stats');

// ── Admin – Teachers ──────────────────────────────────────────────────────────
export const getTeachers = (q = '') =>
  API.get('/api/teachers', { params: q ? { q } : {} });
export const createTeacher = (payload) => API.post('/api/teachers', payload);
export const editTeacher = (id, payload) => API.put(`/api/teachers/${id}`, payload);
export const deleteTeacher = (id) => API.delete(`/api/teachers/${id}`);

// ── Contact Us ────────────────────────────────────────────────────────────────
export const submitQuery = (payload) =>
  API.post('/api/contact', payload);

export const getAdminQueries = () =>
  API.get('/api/contact');

export const resolveQuery = (id) =>
  API.patch(`/api/contact/${id}/resolve`);

export const deleteQuery = (id) =>
  API.delete(`/api/contact/${id}`);

export const getQueryStats = () =>
  API.get('/api/contact/stats');

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export const getAdminDashboard = () => API.get('/api/dashboard');

// ── Attendance ────────────────────────────────────────────────────────────────
export const createAttendance = (payload) => API.post('/api/attendance', payload);
export const listAttendance = (studentId) => API.get(`/api/attendance/${studentId}`);

// ── Notes ─────────────────────────────────────────────────────────────────────
export const createNote = (payload) =>
  API.post('/api/notes', payload);
export const listNotes = () => API.get('/api/notes');
export const deleteNote = (noteId) =>
  API.delete(`/api/notes/${noteId}`);
export const getNoteFileUrl = (noteId) => `${apiBaseURL}/api/notes/${noteId}/file`;

// ── Results ───────────────────────────────────────────────────────────────────
export const createResult = (payload) => API.post('/api/grades', payload);
export const listResults = (studentId) => API.get(`/api/grades/${studentId}`);

// ── Quiz ──────────────────────────────────────────────────────────────────────
export const createQuiz = (payload) => API.post('/api/quiz', payload);
export const listQuizzes = () => API.get('/api/quiz');
export const deleteQuiz = (quizId) =>
  API.post(`/api/quiz/${quizId}/delete`);
export const submitQuiz = (quizId, payload) =>
  API.post(`/api/quiz/${quizId}/submit`, payload);
export const markQuiz = (quizId, payload) =>
  API.post(`/api/quiz/${quizId}/mark`, payload);
export const viewQuizResults = (quizId) =>
  API.get(`/api/quiz/${quizId}/results`);

// ── Courses ───────────────────────────────────────────────────────────────────
export const listCourses = () => API.get('/api/courses');
export const createCourse = (payload) => API.post('/api/courses', payload);

export default API;
