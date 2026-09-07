import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export function getReservationError(error: unknown) {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400: return 'Los datos de la reserva no son válidos. Revisa la cantidad y el evento.'
      case 401: return 'Tu sesión no es válida o ha expirado. Inicia sesión nuevamente para reservar.'
      case 404: return 'Este evento ya no está disponible.'
      case 409: return 'Ya no hay suficientes tickets para esa cantidad. Actualizamos la disponibilidad; revisa la cantidad antes de intentar nuevamente.'
    }
  }
  if (error instanceof ZodError) return 'No pudimos validar la confirmación de la reserva. Comprueba si se realizó antes de volver a intentarlo.'
  return 'No pudimos confirmar el resultado de la reserva. Comprueba tu conexión y si la reserva se realizó antes de volver a intentarlo.'
}
