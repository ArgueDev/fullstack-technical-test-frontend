import { apiClient } from '../api/apiClient'
import { eventSchema, eventsSchema, eventFormSchema, type EventInput } from '../schemas/event.schema'

export async function getEvents(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>('/events', { signal })
  return eventsSchema.parse(response.data)
}

export async function getEventById(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<unknown>(`/events/${encodeURIComponent(id)}`, { signal })
  return eventSchema.parse(response.data)
}

export async function createEvent(input: EventInput) {
  const response = await apiClient.post<unknown>('/events', eventFormSchema.parse(input))
  return eventSchema.parse(response.data)
}

export async function updateEvent(id: string, input: EventInput) {
  const response = await apiClient.put<unknown>(`/events/${encodeURIComponent(id)}`, eventFormSchema.parse(input))
  return eventSchema.parse(response.data)
}

export async function deleteEvent(id: string) {
  await apiClient.delete<void>(`/events/${encodeURIComponent(id)}`)
}
