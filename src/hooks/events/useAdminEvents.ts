import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent, updateEvent, deleteEvent } from '../../services/event.service'
import type { EventInput } from '../../schemas/event.schema'
import { eventKeys } from './useEvents'

export function useAdminEvents() {
  const client = useQueryClient()
  const refresh = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: eventKeys.all, exact: true }),
      ...(id ? [client.invalidateQueries({ queryKey: eventKeys.detail(id), exact: true })] : []),
    ])
  }
  const create = useMutation({ mutationFn: createEvent, retry: false, onSettled: () => refresh() })
  const update = useMutation({ mutationFn: ({ id, input }: { id: string; input: EventInput }) => updateEvent(id, input), retry: false, onSettled: (_data, _error, { id }) => refresh(id) })
  const remove = useMutation({ mutationFn: deleteEvent, retry: false, onSettled: (_data, _error, id) => refresh(id) })
  return { create, update, remove }
}
