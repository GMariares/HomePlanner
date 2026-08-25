import { useMemo, useState } from 'react'
import { Dia } from './Dia'
import { ListaSemana } from './ListaSemana'
import { useSemana } from '../dominio/estado'
import { chaveDaSemana, dataDeChave, diaDaSemana, diasEntre, indiceDeHoje, inicioDaSemana, intervalo } from '../dominio/semana'
import { parteDoDia, type Parte } from './Periodo'
import type { Casa, Entrada } from '../dominio/tipos'
import { ISetaEsq, ISetaDir } from './Icones'

const ORDEM = { evento: 0, tarefa: 1, refeicao: 2 } as const

/** Uma entrada vista de um dia: qual parte do período este dia mostra. */
export interface ComParte {
  entrada: Entrada
  parte: Parte
  dataDoInicio: Date
}

export function Semana({ casa }: { casa: Casa }) {
  const [inicio, definirInicio] = useState(() => inicioDaSemana())
  const chave = chaveDaSemana(inicio)
  const {
    entradas, estado, vazia, falhouAoGuardar, semPeriodos,
    alterar, acrescentar, apagar, mover, escreverExemplo,
  } = useSemana(casa.id, chave)
  const hoje = indiceDeHoje(inicio)

  /* Uma entrada com período ocupa todos os dias entre o princípio e o fim,
     e é uma linha só na base de dados: aqui repete-se por dia, com a parte
     deduzida — começa, continua, acaba. Uma viagem que entrou pela semana
     passada aparece nesta a partir de segunda, como deve. */
  const porDia = useMemo(() => {
    const mapa: Record<number, ComParte[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }

    for (const e of entradas) {
      if (e.dia === null) continue

      /* Onde começa: a data que a base de dados gerou. Uma entrada lida nesta
         semana pode ter começado na anterior, e é `inicio_data` que o diz.
         Sem a migração corrida, cai-se no dia dentro da semana mostrada. */
      const dataDoInicio = e.inicioData ? dataDeChave(e.inicioData) : diaDaSemana(inicio, e.dia)
      const fim = e.fimData ? dataDeChave(e.fimData) : dataDoInicio

      for (let i = 0; i <= 6; i++) {
        const data = diaDaSemana(inicio, i)
        if (diasEntre(dataDoInicio, data) < 0 || diasEntre(data, fim) < 0) continue
        mapa[i].push({
          entrada: e,
          parte: parteDoDia(e, dataDoInicio, data),
          dataDoInicio,
        })
      }
    }

    for (const k of Object.keys(mapa)) {
      mapa[+k].sort((a, b) => {
        const g = ORDEM[a.entrada.genero] - ORDEM[b.entrada.genero]
        if (g !== 0) return g
        const ha = a.parte === 'unico' || a.parte === 'inicio' ? a.entrada.hora : null
        const hb = b.parte === 'unico' || b.parte === 'inicio' ? b.entrada.hora : null
        if (ha && hb) return ha.localeCompare(hb)
        return ha ? -1 : hb ? 1 : 0
      })
    }
    return mapa
  }, [entradas, inicio])

  const semData = useMemo(() => entradas.filter(e => e.dia === null), [entradas])

  const mover7 = (d: Date, n: number) => {
    const novo = new Date(d)
    novo.setDate(novo.getDate() + n * 7)
    return novo
  }

  const diaProps = (i: number) => ({
    indice: i,
    data: diaDaSemana(inicio, i),
    entradas: porDia[i],
    hoje: hoje === i,
    aoAcrescentar: acrescentar,
    aoAlterar: alterar,
    aoApagar: apagar,
    aoMover: mover,
  })

  return (
    <main className="pagina">
      <header className="pagina-cabeca">
        <div>
          <h2 className="pagina-titulo">A semana</h2>
          <p className="pagina-sub">{intervalo(inicio)}</p>
        </div>
        <nav className="semana-nav" aria-label="Semanas">
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(d => mover7(d, -1))}>
            <ISetaEsq lado={16} />
            <span className="sr-only">Semana anterior</span>
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(inicioDaSemana())} disabled={hoje >= 0}>
            Esta semana
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(d => mover7(d, 1))}>
            <ISetaDir lado={16} />
            <span className="sr-only">Semana seguinte</span>
          </button>
        </nav>
      </header>

      {estado === 'sem-migracao' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem tabelas</span>
          <span>
            A base de dados ainda não tem a casa. Corra
            <code> supabase/migrations/20260824120000_caderneta.sql </code>
            no SQL Editor do projecto e recarregue.
          </span>
        </p>
      )}
      {semPeriodos && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Falta a quinta migração</span>
          <span>
            A semana funciona, mas sem períodos: não dá para marcar a que horas
            uma coisa acaba, nem levá-la por vários dias. Corra
            <code> supabase/migrations/20260825120000_periodos.sql </code>
            no SQL Editor.
          </span>
        </p>
      )}

      {estado === 'sem-rede' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem ligação</span>
          <span>A mostrar a última versão guardada neste aparelho. O que escrever agora pode não chegar aos outros.</span>
        </p>
      )}
      {falhouAoGuardar && estado !== 'sem-rede' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor. O que está escrito continua aqui.</span>
        </p>
      )}
      {estado === 'pronto' && vazia && (
        <p className="faixa faixa--calma" role="note">
          <span>Uma semana em branco.</span>
          <button type="button" className="botao-texto" onClick={escreverExemplo}>
            Escrever uma semana de exemplo
          </button>
        </p>
      )}

      <div className="dias">
        {[0, 1, 2, 3, 4, 5, 6].map(i => <Dia key={i} {...diaProps(i)} />)}
        <ListaSemana
          entradas={semData}
          aoAcrescentar={acrescentar}
          aoAlterar={alterar}
          aoApagar={apagar}
          aoMover={mover}
        />
      </div>
    </main>
  )
}
