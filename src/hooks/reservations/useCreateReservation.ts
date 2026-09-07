import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReservation } from '../../services/reservation.service'
import { eventKeys } from '../events/useEvents'

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createReservation,
    retry: false,
    // Refresh even after an ambiguous network failure: the server may have committed.
    onSettled: async (_data, _error, { eventId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId), exact: true }),
        queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true, refetchType: 'all' }),
      ])
    },
  })
}
