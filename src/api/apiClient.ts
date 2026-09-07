import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
export const apiClient = axios.create({ baseURL: apiUrl, timeout: 10_000 })

apiClient.interceptors.request.use((config) => {
  if (typeof apiUrl !== 'string' || !apiUrl.trim()) {
    throw new Error('VITE_API_URL is not configured')
  }
  return config
})
