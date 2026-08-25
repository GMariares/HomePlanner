import { useEffect, useRef, useState } from 'react'
import { IVisto } from './Icones'

/**
 * O visto: um círculo na cor do módulo. Por fazer é um aro; feito enche-se
 * e o traço desenha-se — o único floreado que uma compra merece.
 */
export function Visto({ feita, aoAlternar, rotulo }: {
  feita: boolean
  aoAlternar: () => void
  rotulo: string
}) {
  const [acabado, definirAcabado] = useState(false)
  const anterior = useRef(feita)

  useEffect(() => {
    if (feita && !anterior.current) {
      definirAcabado(true)
      const t = setTimeout(() => definirAcabado(false), 400)
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
      className="visto"
      data-acabado={acabado || undefined}
    >
      <span className="sr-only">{rotulo}</span>
      <IVisto lado={16} strokeWidth={2.6} />
    </button>
  )
}
