import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contest API
export const contestAPI = {
  getContest: (contestId) => api.get(`/contests/${contestId}`),
  getLeaderboard: (contestId) => api.get(`/contests/${contestId}/leaderboard`),
  getActiveContests: () => api.get('/contests'),
};

// Submission API
export const submissionAPI = {
  submitCode: (submission) => api.post('/submissions', submission),
  getSubmission: (submissionId) => api.get(`/submissions/${submissionId}`),
};

export default api;
