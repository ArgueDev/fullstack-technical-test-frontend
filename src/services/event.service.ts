import { apiClient } from '../api/apiClient'
import { eventsSchema } from '../schemas/event.schema'

export async function getEvents(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>('/events', { signal })
  return eventsSchema.parse(response.data)
}
