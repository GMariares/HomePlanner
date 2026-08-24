import { useLayoutEffect, useRef } from 'react'

/**
 * Escrever na linha. Um texto comprido não estica o dia nem se corta:
 * passa para a pauta seguinte, como num caderno.
 */
export function Escrita({ valor, rotulo, cor, esbatido, aoMudar, aoTerminar }: {
  valor: string
  rotulo: string
  cor?: string
  esbatido?: boolean
  aoMudar: (v: string) => void
  aoTerminar?: () => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const ajustar = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useLayoutEffect(ajustar, [valor])

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
        if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLTextAreaElement).blur() }
      }}
    />
  )
}
