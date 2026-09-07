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

export const eventFormSchema = eventSchema.pick({ name: true, date: true, location: true, availableTickets: true }).extend({
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  location: z.string().trim().min(1, 'La ubicación es obligatoria.'),
  date: z.iso.date({ error: 'Selecciona una fecha válida.' }),
  availableTickets: z.number({ error: 'Ingresa una cantidad válida.' }).int('La cantidad debe ser entera.').min(0, 'La cantidad no puede ser negativa.'),
})
export type EventInput = z.infer<typeof eventFormSchema>
