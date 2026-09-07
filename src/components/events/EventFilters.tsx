export type EventFilterValues = {
  date: string
  location: string
  availability: string
}

type Props = {
  filters: EventFilterValues
  onChange: (filters: EventFilterValues) => void
  onReset: () => void
  disabled: boolean
}

export function EventFilters({ filters, onChange, onReset, disabled }: Props) {
  const active = filters.date !== '' || filters.location !== '' || filters.availability !== 'all'
  return (
    <section aria-label="Filtros de eventos" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <fieldset disabled={disabled} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end disabled:opacity-60">
        <legend className="sr-only">Filtrar eventos</legend>
        <div>
          <label htmlFor="event-date" className="filter-label">Fecha</label>
          <input id="event-date" type="date" value={filters.date} onChange={(e) => onChange({ ...filters, date: e.target.value })} className="filter-input" />
        </div>
        <div>
          <label htmlFor="event-location" className="filter-label">Ubicación</label>
          <input id="event-location" type="search" placeholder="Buscar ciudad o lugar" value={filters.location} onChange={(e) => onChange({ ...filters, location: e.target.value })} className="filter-input" />
        </div>
        <div>
          <label htmlFor="event-availability" className="filter-label">Disponibilidad</label>
          <select id="event-availability" value={filters.availability} onChange={(e) => onChange({ ...filters, availability: e.target.value })} className="filter-input">
            <option value="all">Todos</option>
            <option value="available">Con tickets disponibles</option>
            <option value="sold-out">Sin tickets disponibles</option>
          </select>
        </div>
        <button type="button" disabled={!active} onClick={onReset} className="rounded-lg px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50">Limpiar filtros</button>
      </fieldset>
    </section>
  )
}
