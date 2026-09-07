import type { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & { id: string; label: string; error?: string }

export function AuthField({ id, label, error, ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="filter-label">{label}</label>
      <input {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="filter-input" />
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-red-800">{error}</p>}
    </div>
  )
}
