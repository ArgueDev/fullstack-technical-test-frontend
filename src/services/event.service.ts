import { apiClient } from '../api/apiClient'
import { eventSchema, eventsSchema } from '../schemas/event.schema'

export async function getEvents(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>('/events', { signal })
  return eventsSchema.parse(response.data)
}

export async function getEventById(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<unknown>(`/events/${encodeURIComponent(id)}`, { signal })
  return eventSchema.parse(response.data)
}
