import axios from 'axios'

const _env = (import.meta as any).env || {}
const BASE_URL = _env.VITE_API_URL ? `${_env.VITE_API_URL}/api` : '/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
}

export const coffeeApi = {
  list: () => api.get('/coffees'),
  get: (id: string) => api.get(`/coffees/${id}`),
  scanQR: (token: string) => api.get(`/coffees/qr/${token}`),
}

export const recommendApi = {
  recommend: (data: { flavorTags: string[], intensity: number, mood: string }) =>
    api.post('/recommendations', data),
  rate: (data: any) => api.post('/recommendations/rate', data),
}

export const tempApi = {
  simulate: (data: any) => api.post('/temperature/simulate', data),
  options: () => api.get('/temperature/options'),
}

export const traceApi = {
  get: (coffeeId: string) => api.get(`/traceability/${coffeeId}`),
}
