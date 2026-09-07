import { skipToken, useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/useAuth'
import { getMyReservations } from '../../services/reservation.service'

export const reservationKeys = {
  all: ['reservations'] as const,
  mine: (userId: string | undefined) => [...reservationKeys.all, 'mine', userId] as const,
}

export function useMyReservations() {
  const { user } = useAuth()
  return useQuery({
    queryKey: reservationKeys.mine(user?.userId),
    queryFn: user ? ({ signal }) => getMyReservations(signal) : skipToken,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}
