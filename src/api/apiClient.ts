import axios from 'axios'
import { authStorage } from '../utils/authStorage'

const apiUrl = import.meta.env.VITE_API_URL
export const apiClient = axios.create({ baseURL: apiUrl, timeout: 10_000 })

apiClient.interceptors.request.use((config) => {
  if (typeof apiUrl !== 'string' || !apiUrl.trim()) {
    throw new Error('VITE_API_URL is not configured')
  }
  const token = authStorage.getToken()
  if (token && config.url !== '/auth/login' && config.url !== '/auth/register') {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

apiClient.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    const token = authStorage.getToken()
    // A delayed 401 from an older session must not log out a newer session.
    if (token && error.config?.headers.get('Authorization') === `Bearer ${token}`) {
      authStorage.clear()
    }
  }
  return Promise.reject(error)
})
