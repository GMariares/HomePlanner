import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Escrever na linha. Um texto comprido não estica o dia nem se corta:
 * passa para a pauta seguinte, como num caderno.
 */
export function Escrita({ valor, rotulo, cor, esbatido, aoMudar, aoTerminar, aoConfirmar }: {
  valor: string
  rotulo: string
  cor?: string
  esbatido?: boolean
  aoMudar: (v: string) => void
  aoTerminar?: () => void
  /** Enter confirma e deixa o cursor onde está, para se escrever linha atrás de linha. */
  aoConfirmar?: () => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const ajustar = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useLayoutEffect(ajustar, [valor])

  /* A altura mede-se em pautas, e uma pauta só se sabe medir depois da letra
     chegar. Medida com a letra de recurso, uma linha curta ocupa duas e o dia
     abre um buraco. Remede-se quando a fonte carrega e quando a coluna muda. */
  useEffect(() => {
    let vivo = true
    document.fonts?.ready.then(() => { if (vivo) ajustar() })
    const pai = ref.current?.parentElement
    const observador = pai ? new ResizeObserver(() => ajustar()) : null
    if (pai && observador) observador.observe(pai)
    return () => { vivo = false; observador?.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <textarea
      ref={ref}
      className="escrita"
      style={cor ? { color: cor } : undefined}
      data-esbatido={esbatido || undefined}
      rows={1}
      value={valor}
      placeholder="escrever…"
      aria-label={rotulo}
      spellCheck={false}
      onChange={e => { aoMudar(e.target.value); ajustar() }}
      onBlur={aoTerminar}
      onKeyDown={e => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        if (aoConfirmar) aoConfirmar()
        else (e.target as HTMLTextAreaElement).blur()
      }}
    />
  )
}
