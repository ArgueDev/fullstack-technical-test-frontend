import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

export function getEventDetailError(error: Error) {
  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return { title: 'Evento no encontrado', message: 'El evento que buscas no existe o ya no está disponible.', canRetry: false }
    }
    if (error.response?.status === 400 || error.response?.status === 422) {
      return { title: 'Identificador de evento inválido', message: 'El enlace del evento no es válido. Vuelve a la lista para seleccionar un evento.', canRetry: false }
    }
    if (!error.response) {
      return { title: 'No pudimos conectar con el servidor', message: 'Comprueba tu conexión e intenta cargar el evento nuevamente.', canRetry: true }
    }
  }
  if (error instanceof ZodError) {
    return { title: 'No pudimos mostrar el evento', message: 'Los datos recibidos no tienen el formato esperado. Intenta nuevamente más tarde.', canRetry: true }
  }
  return { title: 'No pudimos cargar el evento', message: 'Ocurrió un problema al consultar el evento. Intenta nuevamente en unos minutos.', canRetry: true }
}
