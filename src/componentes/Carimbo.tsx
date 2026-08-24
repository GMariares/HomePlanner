import { useEffect, useRef, useState } from 'react'

/**
 * O campo do carimbo e o carimbo ocupam o mesmo sítio: carrega-se onde a
 * tinta vai cair. Por fazer, é uma casa impressa a tracejado à espera;
 * feita, é o "Visto", como o professor carimba a caderneta.
 */
export function CampoDeCarimbo({ feita, aoAlternar, rotulo }: {
  feita: boolean
  aoAlternar: () => void
  rotulo: string
}) {
  const [acabadoDeCarimbar, definirAcabado] = useState(false)
  const anterior = useRef(feita)

  useEffect(() => {
    if (feita && !anterior.current) {
      definirAcabado(true)
      const t = setTimeout(() => definirAcabado(false), 600)
      anterior.current = feita
      return () => clearTimeout(t)
    }
    anterior.current = feita
  }, [feita])

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={feita}
      onClick={aoAlternar}
      className="campo-carimbo"
      title={feita ? 'Tirar o visto' : 'Dar o visto'}
    >
      <span className="sr-only">{rotulo}</span>
      {feita ? (
        <span className="carimbo" data-acabado-de-carimbar={acabadoDeCarimbar || undefined}>
          <svg viewBox="0 0 74 30" fill="none" aria-hidden="true">
            <rect x="1.6" y="1.6" width="70.8" height="26.8" rx="4"
              stroke="currentColor" strokeWidth="2.4" />
            <text x="37" y="20.5" textAnchor="middle" fill="currentColor"
              fontFamily="Archivo, sans-serif" fontSize="13.5" fontWeight="700"
              letterSpacing="2.4">VISTO</text>
          </svg>
        </span>
      ) : (
        <svg viewBox="0 0 74 30" fill="none" aria-hidden="true">
          <rect x="1.6" y="1.6" width="70.8" height="26.8" rx="4"
            stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 3.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
