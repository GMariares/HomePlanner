import { useState } from 'react'
import type { Entrada, Genero } from '../dominio/tipos'
import { DIAS, curto } from '../dominio/semana'
import { novoId } from '../dominio/estado'
import { Linha } from './Linha'
import { Escrita } from './Escrita'

/** Uma pauta em branco também é uma pauta: escreve-se nela e passa a existir. */
function LinhaEmBranco({ rotulo, aoEscrever }: { rotulo: string; aoEscrever: (texto: string) => void }) {
  const [texto, definir] = useState('')
  return (
    <div className="linha linha--branco">
      <span className="linha-goteira" />
      <span className="linha-corpo">
        <Escrita
          valor={texto}
          rotulo={rotulo}
          aoMudar={definir}
          aoTerminar={() => { if (texto.trim()) { aoEscrever(texto.trim()); definir('') } }}
        />
      </span>
      <span className="linha-hora" />
      <span className="linha-accoes" />
    </div>
  )
}

export function Dia({ indice, data, entradas, hoje, pautasMinimas = 3, aoAcrescentar, aoAlterar, aoApagar, aoMover }: {
  indice: number
  data: Date
  entradas: Entrada[]
  hoje: boolean
  pautasMinimas?: number
  aoAcrescentar: (entrada: Entrada) => void
  aoAlterar: (id: string, mudanca: Partial<Entrada>) => void
  aoApagar: (id: string) => void
  aoMover: (id: string, destino: number | null) => void
}) {
  const nome = DIAS[indice]
  const brancos = Math.max(1, pautasMinimas - entradas.length)

  const escrever = (texto: string) => {
    const genero: Genero = 'evento'
    aoAcrescentar({ id: novoId(), dia: indice, genero, autor: null, texto, hora: null })
  }

  return (
    <section className={`dia ${hoje ? 'dia--hoje' : ''}`} aria-labelledby={`dia-${indice}`}>
      {hoje && <span className="fita" aria-hidden="true" />}
      <header className="dia-cabecalho">
        <h3 id={`dia-${indice}`} className="dia-nome">
          {nome}
          {hoje && <span className="dia-hoje impresso">hoje</span>}
        </h3>
        <span className="dia-data impresso">{curto(data)}</span>
      </header>

      <div className="dia-corpo pauta margem">
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
        {Array.from({ length: brancos }, (_, i) => (
          <LinhaEmBranco
            key={`b${i}`}
            rotulo={`Escrever em ${nome}, ${curto(data)}`}
            aoEscrever={escrever}
          />
        ))}
      </div>
    </section>
  )
}
