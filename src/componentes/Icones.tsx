/** Ícones desenhados, um só traço de 1.5, na gramática do caderno. */

export function Chaveta({ parte }: { parte: 'inicio' | 'meio' | 'fim' }) {
  const d =
    parte === 'inicio' ? 'M11 3 H4 V22'
    : parte === 'fim' ? 'M4 0 V19 H11'
    : 'M4 0 V22'
  return (
    <svg viewBox="0 0 14 22" width="14" height="22" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SetaMudanca() {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" fill="none" aria-hidden="true">
      <path d="M1 6h13m0 0-4.5-4.5M14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Reticencias() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="3" cy="8" r="1.35" fill="currentColor" />
      <circle cx="8" cy="8" r="1.35" fill="currentColor" />
      <circle cx="13" cy="8" r="1.35" fill="currentColor" />
    </svg>
  )
}

export function Anterior() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Seguinte() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
