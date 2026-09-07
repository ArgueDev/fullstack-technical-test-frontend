import { skipToken, useQuery } from '@tanstack/react-query'
import { getEventById } from '../../services/event.service'
import { eventKeys } from './useEvents'

export function useEvent(id: string | undefined) {
  // IDs are opaque strings in the existing contract; do not assume UUIDs.
  const isValidId = id !== undefined && id.trim().length > 0 && id !== '.' && id !== '..'
  const query = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: isValidId ? ({ signal }) => getEventById(id, signal) : skipToken,
    staleTime: 60_000,
    retry: false,
  })

  return { ...query, isValidId }
}
