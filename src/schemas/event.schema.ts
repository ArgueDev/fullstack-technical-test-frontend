import { z } from 'zod'

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.iso.date(),
  location: z.string(),
  availableTickets: z.number().int().nonnegative(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export const eventsSchema = z.array(eventSchema)
export type Event = z.infer<typeof eventSchema>
