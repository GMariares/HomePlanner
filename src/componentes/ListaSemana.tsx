import { useState } from 'react'
import type { Entrada } from '../dominio/tipos'
import { novoId } from '../dominio/estado'
import { Linha } from './Linha'
import { Escrita } from './Escrita'
import { useRascunho } from '../dominio/rascunho'

/** O que é desta semana mas não é de nenhum dia. */
export function ListaSemana({ entradas, aoAcrescentar, aoAlterar, aoApagar, aoMover }: {
  entradas: Entrada[]
  aoAcrescentar: (entrada: Entrada) => void
  aoAlterar: (id: string, mudanca: Partial<Entrada>) => void
  aoApagar: (id: string) => void
  aoMover: (id: string, destino: number | null) => void
}) {
  const [texto, definir] = useState('')
  const guardar = () => {
    if (!texto.trim()) return
    aoAcrescentar({ id: novoId(), dia: null, genero: 'tarefa', autor: null, texto: texto.trim(), hora: null, feita: false })
    definir('')
  }

  const { linha, aoPerderFoco } = useRascunho(guardar)

  return (
    <section className="lista" aria-labelledby="lista-titulo">
      <header className="dia-cabecalho">
        <h3 id="lista-titulo" className="dia-nome dia-nome--lista">Esta semana</h3>
        <span className="dia-data impresso">sem dia marcado</span>
      </header>
      <div className="dia-corpo pauta margem">
        {entradas.map(e => (
          <Linha
            key={e.id}
            entrada={e}
            contexto="Esta semana, sem dia marcado"
            aoAlterar={m => aoAlterar(e.id, m)}
            aoApagar={() => aoApagar(e.id)}
            aoMover={d => aoMover(e.id, d)}
          />
        ))}
        <div className="linha linha--branco" ref={linha} onBlur={aoPerderFoco}>
          <span className="linha-goteira" />
          <span className="linha-corpo">
            <Escrita
              valor={texto}
              rotulo="Escrever uma tarefa sem dia marcado"
              aoMudar={definir}
              aoConfirmar={guardar}
            />
          </span>
          <span className="linha-hora" />
          <span className="linha-accoes" />
        </div>
      </div>
    </section>
  )
}
