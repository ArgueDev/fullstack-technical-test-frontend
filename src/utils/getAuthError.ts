import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export function getAuthError(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) return 'No pudimos conectar con el servidor. Comprueba tu conexión e inténtalo nuevamente.'
    if (error.response.status === 401) return 'Correo electrónico o contraseña incorrectos.'
    if (error.response.status === 409) return 'Este correo electrónico ya está registrado. Inicia sesión con tu cuenta.'
    if ([400, 422].includes(error.response.status)) return 'Revisa los datos del formulario e inténtalo nuevamente.'
  }
  if (error instanceof ZodError) return 'La respuesta del servidor no tiene el formato esperado. Intenta nuevamente más tarde.'
  return 'No pudimos completar la operación. Intenta nuevamente; comprueba que tu navegador permita guardar la sesión.'
}
