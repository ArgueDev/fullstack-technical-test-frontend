import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../../services/event.service'

export const eventKeys = {
  all: ['events'] as const,
  detail: (id: string | undefined) => [...eventKeys.all, 'detail', id] as const,
}

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: ({ signal }) => getEvents(signal),
    staleTime: 60_000,
    retry: false,
  })
}
