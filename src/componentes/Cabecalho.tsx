import { useEffect, useState } from 'react'
import { intervalo } from '../dominio/semana'
import { Anterior, Seguinte } from './Icones'

const CHAVE_CASA = 'homeplanner:casa'

/**
 * A capa. O nome da casa é o único sítio em toda a aplicação onde entra
 * uma letra de mão — como a etiqueta escrita à mão num caderno da escola.
 */
export function Cabecalho({ inicio, aoRecuar, aoAvancar, aoHoje, naSemanaCorrente }: {
  inicio: Date
  aoRecuar: () => void
  aoAvancar: () => void
  aoHoje: () => void
  naSemanaCorrente: boolean
}) {
  const [casa, definirCasa] = useState('')

  useEffect(() => {
    try { definirCasa(localStorage.getItem(CHAVE_CASA) ?? '') } catch { /* sem persistência */ }
  }, [])

  const guardar = (v: string) => {
    definirCasa(v)
    try { localStorage.setItem(CHAVE_CASA, v) } catch { /* sem persistência */ }
  }

  return (
    <header className="capa">
      <div className="capa-interior">
        <div className="capa-identidade">
          <input
            className="capa-nome"
            value={casa}
            onChange={e => guardar(e.target.value)}
            placeholder="o nome da família"
            aria-label="Nome da família, escrito na capa"
            maxLength={32}
          />
          <p className="capa-intervalo impresso">{intervalo(inicio)}</p>
        </div>

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
      </div>
    </header>
  )
}
