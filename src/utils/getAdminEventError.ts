import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export function getAdminEventError(error: unknown) {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400: return 'Los datos no son válidos. Revisa los campos del evento.'
      case 401: return 'Tu sesión no es válida. Inicia sesión nuevamente.'
      case 403: return 'No tienes permisos para realizar esta operación.'
      case 404: return 'El evento ya no existe. Se ha actualizado el listado.'
      case 409: return 'No puedes eliminar este evento porque tiene reservas asociadas.'
    }
    if (!error.response) return 'No pudimos conectar con el servidor. Comprueba tu conexión y el listado antes de reintentar.'
  }
  if (error instanceof ZodError) return 'La respuesta no tiene el formato esperado. Comprueba el listado antes de reintentar.'
  return 'No pudimos completar la operación. Comprueba el listado e inténtalo más tarde.'
}
