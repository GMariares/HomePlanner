import { useEffect, useRef, useState, type ReactNode } from 'react'
import { supabase } from '../dominio/supabase'
import type { Casa } from '../dominio/tipos'
import { ICasa, ICalendario, ITalheres, ILivro, IMoeda, IPessoa } from './Icones'

export type Vista = 'inicio' | 'semana' | 'ementa' | 'livro' | 'financas'

const DESTINOS: { id: Vista; rotulo: string; Icone: typeof ICasa }[] = [
  { id: 'inicio', rotulo: 'Início', Icone: ICasa },
  { id: 'semana', rotulo: 'Semana', Icone: ICalendario },
  { id: 'ementa', rotulo: 'Ementa', Icone: ITalheres },
  { id: 'livro', rotulo: 'Livro', Icone: ILivro },
  { id: 'financas', rotulo: 'Finanças', Icone: IMoeda },
]

/** O painel da conta: nome da casa, código, e as saídas. Abre do topo. */
function Conta({ casa, email, aoSair, aoSairDaCasa }: {
  casa: Casa
  email: string
  aoSair: () => void
  aoSairDaCasa: () => void | Promise<void>
}) {
  const [aberto, definirAberto] = useState(false)
  const [aConfirmar, definirAConfirmar] = useState(false)
  const [nome, definirNome] = useState(casa.nome)
  const caixa = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { definirNome(casa.nome) }, [casa.nome])
  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current) }, [])

  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node) && !botao.current?.contains(e.target as Node)) {
        definirAberto(false); definirAConfirmar(false)
      }
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { definirAberto(false); definirAConfirmar(false); botao.current?.focus() }
    }
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  const escrever = (v: string) => {
    definirNome(v)
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => {
      supabase.from('casas').update({ nome: v }).eq('id', casa.id)
    }, 600)
  }

  return (
    <span className="menu-raiz">
      <button
        type="button"
        ref={botao}
        className="botao-gelo"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => definirAberto(v => !v)}
      >
        <span className="sr-only">A conta e a casa</span>
        <IPessoa />
      </button>
      {aberto && (
        <div ref={caixa} role="dialog" aria-label="A conta e a casa" className="menu menu--direita conta-painel">
          <label className="campo">
            <span className="campo-nome">Nome da família</span>
            <input
              className="campo-escrita"
              value={nome}
              onChange={e => escrever(e.target.value)}
              placeholder="a nossa casa"
              maxLength={32}
            />
          </label>
          <p className="conta-codigo">
            <span className="campo-nome">Código da casa</span>
            <strong>{casa.codigo}</strong>
            <span className="conta-nota">quem o tiver entra nesta casa</span>
          </p>
          <p className="conta-email" title={email}>{email}</p>
          {aConfirmar ? (
            <div className="conta-accoes">
              <button type="button" className="botao-texto botao-texto--perigo" onClick={() => aoSairDaCasa()}>
                Sair desta casa
              </button>
              <button type="button" className="botao-texto" onClick={() => definirAConfirmar(false)}>Ficar</button>
            </div>
          ) : (
            <div className="conta-accoes">
              <button type="button" className="botao-texto" onClick={() => definirAConfirmar(true)}>Trocar de casa</button>
              <button type="button" className="botao-texto" onClick={aoSair}>Sair da conta</button>
            </div>
          )}
        </div>
      )}
    </span>
  )
}

/** A concha: topo com a casa e a conta, navegação em pílulas ou no polegar. */
export function Concha({ casa, email, vista, aoTrocarDeVista, aoSair, aoSairDaCasa, children }: {
  casa: Casa
  email: string
  vista: Vista
  aoTrocarDeVista: (v: Vista) => void
  aoSair: () => void
  aoSairDaCasa: () => void | Promise<void>
  children: ReactNode
}) {
  const navegacao = (classe: string, comIcones: boolean) => (
    <nav className={`nav ${classe}`} aria-label="As áreas da casa">
      {DESTINOS.map(({ id, rotulo, Icone }) => (
        <button
          key={id}
          type="button"
          className="nav-item"
          aria-current={vista === id ? 'page' : undefined}
          onClick={() => aoTrocarDeVista(id)}
        >
          {comIcones && <span className="nav-icone"><Icone /></span>}
          {rotulo}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="concha">
      <header className="topo">
        <h1 className="topo-casa">{casa.nome || 'A nossa casa'}</h1>
        {navegacao('nav--topo', false)}
        <Conta casa={casa} email={email} aoSair={aoSair} aoSairDaCasa={aoSairDaCasa} />
      </header>
      {children}
      {navegacao('nav--fundo', true)}
    </div>
  )
}
