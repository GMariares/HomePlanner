import type { CSSProperties } from 'react'
import type { Entrada } from '../dominio/tipos'
import { novoId } from '../dominio/estado'
import { Linha } from './Linha'
import { FilaEmBranco } from './Dia'

/** O que é desta semana mas não é de nenhum dia. */
export function ListaSemana({ entradas, aoAcrescentar, aoAlterar, aoApagar, aoMover }: {
  entradas: Entrada[]
  aoAcrescentar: (entrada: Entrada) => void
  aoAlterar: (id: string, mudanca: Partial<Entrada>) => void
  aoApagar: (id: string) => void
  aoMover: (id: string, destino: number | null) => void
}) {
  return (
    <section
      className="modulo com-cor"
      style={{ '--cor': 'var(--c-semana)' } as CSSProperties}
      aria-labelledby="lista-titulo"
    >
      <header className="dia-cabeca">
        <h3 id="lista-titulo" className="dia-nome">Esta semana</h3>
        <span className="dia-data">sem dia marcado</span>
      </header>
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
      <FilaEmBranco
        rotulo="Escrever uma tarefa sem dia marcado"
        aoEscrever={texto => aoAcrescentar({ id: novoId(), dia: null, genero: 'tarefa', autor: null, texto, hora: null, feita: false })}
      />
    </section>
  )
}
