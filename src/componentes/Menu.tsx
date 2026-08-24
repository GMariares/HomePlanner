import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export interface Opcao {
  id: string
  rotulo: string
  tinta?: string
  activa?: boolean
  aoEscolher: () => void
}

/**
 * Uma lista que abre junto à linha. Não é um modal: nada aqui interrompe
 * o que se está a ler, e a página por baixo continua legível.
 */
export function Menu({ gatilho, titulo, opcoes, alinhar = 'esquerda' }: {
  gatilho: (props: { aberto: boolean; abrir: () => void; refs: React.Ref<HTMLButtonElement>; controla: string }) => ReactNode
  titulo: string
  opcoes: Opcao[]
  alinhar?: 'esquerda' | 'direita'
}) {
  const [aberto, definirAberto] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node) && !botao.current?.contains(e.target as Node)) {
        definirAberto(false)
      }
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { definirAberto(false); botao.current?.focus() }
    }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', tecla)
    caixa.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  return (
    <span className="menu-raiz">
      {gatilho({ aberto, abrir: () => definirAberto(v => !v), refs: botao, controla: id })}
      {aberto && (
        <div ref={caixa} id={id} role="menu" aria-label={titulo}
          className={`menu ${alinhar === 'direita' ? 'menu--direita' : ''}`}>
          <p className="impresso menu-titulo">{titulo}</p>
          {opcoes.map(o => (
            <button
              key={o.id}
              type="button"
              role="menuitem"
              className="menu-item"
              aria-current={o.activa || undefined}
              style={o.tinta ? { color: o.tinta } : undefined}
              onClick={() => { o.aoEscolher(); definirAberto(false); botao.current?.focus() }}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </span>
  )
}
