import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:4000' });

export const getPlayers = () => api.get('/players').then(r => r.data);
export const addPlayer = (data) => api.post('/players', data).then(r => r.data);
export const deletePlayer = (id) => api.delete(`/players/${id}`).then(r => r.data);

export const getTrainings = () => api.get('/trainings').then(r => r.data);
export const addTraining = (data) => api.post('/trainings', data).then(r => r.data);
export const deleteTraining = (id) => api.delete(`/trainings/${id}`).then(r => r.data);

export const addScore = (data) => api.post('/scores', data).then(r => r.data);
export const getPlayerScores = (id) => api.get(`/scores/player/${id}`).then(r => r.data);
export const getTeamScoresByTraining = (trainingId) => api.get(`/scores/team/${trainingId}`).then(r => r.data);
export const getOverview = (metric) => api.get(`/scores/overview/${metric}`).then(r => r.data);
export const deleteScore = (id) => api.delete(`/scores/${id}`).then(r => r.data);

