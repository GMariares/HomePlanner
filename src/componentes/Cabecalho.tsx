import { useEffect, useRef, useState } from 'react'
import { intervalo } from '../dominio/semana'
import { supabase } from '../dominio/supabase'
import type { Casa } from '../dominio/tipos'
import { Anterior, Seguinte } from './Icones'

/**
 * A capa. O nome da casa é o único sítio em toda a aplicação onde entra
 * uma letra de mão — como a etiqueta escrita à mão num caderno da escola.
 * Agora é o nome da casa a sério, partilhado por quem lá vive.
 */
export function Cabecalho({ casa, email, inicio, aoRecuar, aoAvancar, aoHoje, naSemanaCorrente, aoSair, aoSairDaCasa, vista, aoTrocarDeVista, semSemana }: {
  casa: Casa
  email: string
  /** Que aba está aberta. As abas são as do polegar, no impresso. */
  vista: 'semana' | 'ementa' | 'livro'
  aoTrocarDeVista: (v: 'semana' | 'ementa' | 'livro') => void
  /** O livro não é de nenhuma semana: nessa aba a navegação por semanas sai. */
  semSemana?: boolean
  inicio: Date
  aoRecuar: () => void
  aoAvancar: () => void
  aoHoje: () => void
  naSemanaCorrente: boolean
  aoSair: () => void
  aoSairDaCasa: () => void | Promise<void>
}) {
  const [nome, definirNome] = useState(casa.nome)
  const [aConfirmarSaida, definirAConfirmarSaida] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { definirNome(casa.nome) }, [casa.nome])
  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current) }, [])

  const escrever = (v: string) => {
    definirNome(v)
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => {
      supabase.from('casas').update({ nome: v }).eq('id', casa.id)
    }, 600)
  }

  return (
    <header className="capa">
      <div className="capa-interior">
        <div className="capa-identidade">
          <input
            className="capa-nome"
            value={nome}
            onChange={e => escrever(e.target.value)}
            placeholder="o nome da família"
            aria-label="Nome da família, escrito na capa"
            maxLength={32}
          />
          {!semSemana && <p className="capa-intervalo impresso">{intervalo(inicio)}</p>}
        </div>

        <nav className="abas" aria-label="Secções da caderneta">
          <button
            type="button"
            className="aba impresso"
            aria-current={vista === 'semana' || undefined}
            onClick={() => aoTrocarDeVista('semana')}
          >
            A semana
          </button>
          <button
            type="button"
            className="aba impresso"
            aria-current={vista === 'ementa' || undefined}
            onClick={() => aoTrocarDeVista('ementa')}
          >
            Ementa e compras
          </button>
          <button
            type="button"
            className="aba impresso"
            aria-current={vista === 'livro' || undefined}
            onClick={() => aoTrocarDeVista('livro')}
          >
            O livro
          </button>
        </nav>

        <div className="capa-lado">
          {!semSemana && (
          <nav className="capa-navegacao" aria-label="Semanas">
            <button type="button" className="capa-botao" onClick={aoRecuar}>
              <Anterior />
              <span className="sr-only">Semana anterior</span>
            </button>
            <button
              type="button"
              className="capa-botao capa-botao--texto impresso"
              onClick={aoHoje}
              disabled={naSemanaCorrente}
            >
              Esta semana
            </button>
            <button type="button" className="capa-botao" onClick={aoAvancar}>
              <Seguinte />
              <span className="sr-only">Semana seguinte</span>
            </button>
          </nav>
          )}

          <p className="capa-conta impresso">
            <span title="Quem tiver este código entra nesta caderneta">
              Código <strong className="capa-codigo">{casa.codigo}</strong>
            </span>
            <span className="capa-email" title={email}>{email}</span>
            {aConfirmarSaida ? (
              <>
                <button type="button" className="capa-sair capa-sair--aviso" onClick={() => aoSairDaCasa()}>
                  Sair desta casa
                </button>
                <button type="button" className="capa-sair" onClick={() => definirAConfirmarSaida(false)}>
                  Ficar
                </button>
              </>
            ) : (
              <button type="button" className="capa-sair" onClick={() => definirAConfirmarSaida(true)}>
                Trocar de casa
              </button>
            )}
            <button type="button" className="capa-sair" onClick={aoSair}>Sair da conta</button>
          </p>
        </div>
      </div>
    </header>
  )
}
