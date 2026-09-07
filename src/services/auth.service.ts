import { apiClient } from '../api/apiClient'
import { loginResponseSchema, registerResponseSchema, type LoginInput, type RegisterInput } from '../schemas/auth.schema'

export async function login({ email, password }: LoginInput) {
  const response = await apiClient.post<unknown>('/auth/login', { email, password })
  return loginResponseSchema.parse(response.data)
}

export async function register({ name, email, password }: RegisterInput) {
  const response = await apiClient.post<unknown>('/auth/register', { name, email, password })
  return registerResponseSchema.parse(response.data)
}
