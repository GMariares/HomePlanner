import { useEffect, useMemo, useRef, useState } from 'react'
import { Cabecalho } from './Cabecalho'
import { Dia } from './Dia'
import { ListaSemana } from './ListaSemana'
import { useSemana } from '../dominio/estado'
import { chaveDaSemana, diaDaSemana, indiceDeHoje, inicioDaSemana } from '../dominio/semana'
import type { Casa, Entrada } from '../dominio/tipos'

const ORDEM = { evento: 0, tarefa: 1, refeicao: 2 } as const

export function Semana({ casa, email, aoSair }: { casa: Casa; email: string; aoSair: () => void }) {
  const [inicio, definirInicio] = useState(() => inicioDaSemana())
  const chave = chaveDaSemana(inicio)
  const {
    entradas, estado, vazia, falhouAoGuardar,
    alterar, acrescentar, apagar, mover, escreverExemplo,
  } = useSemana(casa.id, chave)
  const hoje = indiceDeHoje(inicio)

  const porDia = useMemo(() => {
    const mapa: Record<number, Entrada[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    for (const e of entradas) if (e.dia !== null) mapa[e.dia]?.push(e)
    for (const k of Object.keys(mapa)) {
      mapa[+k].sort((a, b) => {
        const g = ORDEM[a.genero] - ORDEM[b.genero]
        if (g !== 0) return g
        if (a.hora && b.hora) return a.hora.localeCompare(b.hora)
        return a.hora ? -1 : b.hora ? 1 : 0
      })
    }
    return mapa
  }, [entradas])

  const semData = useMemo(() => entradas.filter(e => e.dia === null), [entradas])

  const jaAbriu = useRef(false)
  useEffect(() => {
    if (jaAbriu.current || hoje < 2 || estado !== 'pronto') return
    jaAbriu.current = true
    if (!window.matchMedia('(max-width: 63.99rem)').matches) return
    document.getElementById(`dia-${hoje}`)?.closest('.dia')?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [estado, hoje])

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
    <div className="caderneta">
      <Cabecalho
        casa={casa}
        email={email}
        inicio={inicio}
        aoRecuar={() => definirInicio(d => mover7(d, -1))}
        aoAvancar={() => definirInicio(d => mover7(d, 1))}
        aoHoje={() => definirInicio(inicioDaSemana())}
        naSemanaCorrente={hoje >= 0}
        aoSair={aoSair}
      />

      {estado === 'sem-migracao' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem tabelas</span>
          <span>
            A base de dados ainda não tem a caderneta. Corra
            <code> supabase/migrations/20260824120000_caderneta.sql </code>
            no SQL Editor do projecto e recarregue.
          </span>
        </p>
      )}

      {estado === 'sem-rede' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem ligação</span>
          <span>A mostrar a última versão guardada neste aparelho. O que escrever agora pode não chegar aos outros.</span>
        </p>
      )}

      {falhouAoGuardar && estado !== 'sem-rede' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor. O que está escrito continua aqui, mas pode não estar na caderneta dos outros.</span>
        </p>
      )}

      {estado === 'pronto' && vazia && (
        <p className="aviso" role="note">
          <span>Caderneta em branco. As pautas estão à espera.</span>
          <button type="button" className="aviso-repor impresso" onClick={escreverExemplo}>
            Escrever uma semana de exemplo
          </button>
        </p>
      )}

      <main className="abertura-envelope">
        <div className="abertura">
          <div className="pagina pagina--esquerda">
            {[0, 1, 2, 3].map(i => <Dia key={i} {...diaProps(i)} />)}
          </div>

          <div className="lombada" aria-hidden="true" />

          <div className="pagina pagina--direita">
            {[4, 5, 6].map(i => <Dia key={i} {...diaProps(i)} />)}
            <ListaSemana
              entradas={semData}
              aoAcrescentar={acrescentar}
              aoAlterar={alterar}
              aoApagar={apagar}
              aoMover={mover}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
