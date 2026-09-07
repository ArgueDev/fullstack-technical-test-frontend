const formatter = new Intl.DateTimeFormat('es-EC', {
  dateStyle: 'medium', timeStyle: 'short',
})

export function formatDateTime(value: string) {
  return formatter.format(new Date(value))
}
