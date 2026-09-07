import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export function getMyReservationsError(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Tu sesión ha expirado. Inicia sesión nuevamente para consultar tus reservas.'
    if (!error.response) return 'No pudimos conectar con el servidor. Comprueba tu conexión e inténtalo nuevamente.'
  }
  if (error instanceof ZodError) return 'No pudimos mostrar las reservas porque los datos recibidos no tienen el formato esperado. Intenta nuevamente más tarde.'
  return 'No pudimos cargar tus reservas en este momento. Intenta nuevamente en unos minutos.'
}
