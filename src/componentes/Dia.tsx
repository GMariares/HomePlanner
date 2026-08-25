import { useState, type CSSProperties } from 'react'
import type { Entrada, Genero } from '../dominio/tipos'
import { DIAS, curto } from '../dominio/semana'
import { novoId } from '../dominio/estado'
import { Linha } from './Linha'
import { Escrita } from './Escrita'
import { useRascunho } from '../dominio/rascunho'
import { IMais } from './Icones'

/** A linha em branco no fundo do dia: escreve-se nela e passa a existir. */
export function FilaEmBranco({ rotulo, aoEscrever }: { rotulo: string; aoEscrever: (texto: string) => void }) {
  const [texto, definir] = useState('')
  const guardar = () => { if (texto.trim()) { aoEscrever(texto.trim()); definir('') } }
  const { linha, aoPerderFoco } = useRascunho(guardar)
  return (
    <div className="fila fila--branca" ref={linha} onBlur={aoPerderFoco}>
      <span className="fila-mais" aria-hidden="true"><IMais lado={16} /></span>
      <span className="fila-corpo">
        <Escrita valor={texto} rotulo={rotulo} aoMudar={definir} aoConfirmar={guardar} />
      </span>
    </div>
  )
}

/** Um dia é um módulo: o de hoje acende. */
export function Dia({ indice, data, entradas, hoje, aoAcrescentar, aoAlterar, aoApagar, aoMover }: {
  indice: number
  data: Date
  entradas: Entrada[]
  hoje: boolean
  aoAcrescentar: (entrada: Entrada) => void
  aoAlterar: (id: string, mudanca: Partial<Entrada>) => void
  aoApagar: (id: string) => void
  aoMover: (id: string, destino: number | null) => void
}) {
  const nome = DIAS[indice]

  const escrever = (texto: string) => {
    const genero: Genero = 'evento'
    aoAcrescentar({ id: novoId(), dia: indice, genero, autor: null, texto, hora: null })
  }

  return (
    <section
      className="modulo dia-modulo com-cor"
      style={{ '--cor': 'var(--c-semana)' } as CSSProperties}
      data-hoje={hoje || undefined}
      aria-labelledby={`dia-${indice}`}
    >
      <header className="dia-cabeca">
        <h3 id={`dia-${indice}`} className="dia-nome">{nome}</h3>
        <span className="dia-data">{curto(data)}</span>
        {hoje && <span className="dia-hoje-marca">hoje</span>}
      </header>

      {entradas.map(e => (
        <Linha
          key={e.id}
          entrada={e}
          contexto={`${nome}, ${curto(data)}`}
          aoAlterar={m => aoAlterar(e.id, m)}
          aoApagar={() => aoApagar(e.id)}
          aoMover={d => aoMover(e.id, d)}
        />
      ))}

      <FilaEmBranco rotulo={`Escrever em ${nome}, ${curto(data)}`} aoEscrever={escrever} />
    </section>
  )
}
