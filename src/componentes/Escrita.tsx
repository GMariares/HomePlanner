import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Escrever na linha. Um texto comprido não estica o dia nem se corta:
 * passa para a pauta seguinte, como num caderno.
 */
export function Escrita({ valor, rotulo, cor, aoMudar, aoConfirmar }: {
  valor: string
  rotulo: string
  cor?: string
  aoMudar: (v: string) => void
  /** Enter confirma e deixa o cursor onde está, para se escrever linha atrás de linha. */
  aoConfirmar?: () => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  /*
   * O campo guarda o que se está a escrever.
   *
   * Sem isto, um escritor que adia a gravação — como o dos nomes das
   * categorias — devolvia o valor antigo no mesmo instante em que a tecla
   * era carregada, e o campo apagava a letra acabada de escrever: renomear
   * era simplesmente impossível. Enquanto o dedo está no campo manda o que
   * lá está; largado, volta a mandar quem é dono do valor.
   */
  const [local, definirLocal] = useState(valor)
  const dentro = useRef(false)
  useEffect(() => { if (!dentro.current) definirLocal(valor) }, [valor])
  const mostrado = dentro.current ? local : valor

  const ajustar = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useLayoutEffect(ajustar, [mostrado])

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
      rows={1}
      value={mostrado}
      placeholder="escrever…"
      aria-label={rotulo}
      spellCheck={false}
      onFocus={() => { dentro.current = true; definirLocal(valor) }}
      onBlur={() => { dentro.current = false; definirLocal(valor) }}
      onChange={e => { definirLocal(e.target.value); aoMudar(e.target.value); ajustar() }}
      onKeyDown={e => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        if (aoConfirmar) aoConfirmar()
        else (e.target as HTMLTextAreaElement).blur()
      }}
    />
  )
}
