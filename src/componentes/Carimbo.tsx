/**
 * O carimbo do "Visto" — como o professor carimba a caderneta.
 * Uma tarefa por fazer é uma casa impressa em branco; feita, é carimbada.
 */
export function Carimbo() {
  return (
    <span className="carimbo" aria-hidden="true">
      <svg viewBox="0 0 74 30" width="74" height="30" fill="none">
        <rect x="1.6" y="1.6" width="70.8" height="26.8" rx="4"
          stroke="currentColor" strokeWidth="2.2" opacity="0.85" />
        <text x="37" y="20.5" textAnchor="middle" fill="currentColor"
          fontFamily="Archivo, sans-serif" fontSize="13.5" fontWeight="700"
          letterSpacing="2.4" opacity="0.92">VISTO</text>
      </svg>
    </span>
  )
}

export function CasaDeCarimbo({ feita, onToggle, rotulo }: {
  feita: boolean
  onToggle: () => void
  rotulo: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={feita}
      onClick={onToggle}
      className="casa-carimbo"
      title={feita ? 'Tirar o visto' : 'Dar o visto'}
    >
      <span className="sr-only">{rotulo}</span>
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
        <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="1.5"
          stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  )
}
