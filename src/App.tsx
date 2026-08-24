import { useEffect, useMemo, useRef, useState } from 'react'
import { Cabecalho } from './componentes/Cabecalho'
import { Dia } from './componentes/Dia'
import { ListaSemana } from './componentes/ListaSemana'
import { useSemana } from './dominio/estado'
import { chaveDaSemana, diaDaSemana, indiceDeHoje, inicioDaSemana } from './dominio/semana'

const ORDEM_REFEICAO = { evento: 0, tarefa: 1, refeicao: 2 } as const

export default function App() {
  const [inicio, definirInicio] = useState(() => inicioDaSemana())
  const chave = chaveDaSemana(inicio)
  const { entradas, alterar, acrescentar, apagar, mover, repor, falhouAoGuardar } = useSemana(chave)
  const hoje = indiceDeHoje(inicio)

  const porDia = useMemo(() => {
    const mapa: Record<number, typeof entradas> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    for (const e of entradas) if (e.dia !== null) mapa[e.dia]?.push(e)
    for (const k of Object.keys(mapa)) {
      mapa[+k].sort((a, b) => {
        const g = ORDEM_REFEICAO[a.genero] - ORDEM_REFEICAO[b.genero]
        if (g !== 0) return g
        if (a.hora && b.hora) return a.hora.localeCompare(b.hora)
        return a.hora ? -1 : b.hora ? 1 : 0
      })
    }
    return mapa
  }, [entradas])

  const semData = useMemo(() => entradas.filter(e => e.dia === null), [entradas])
  const temExemplo = useMemo(() => entradas.some(e => /^[eu]\d+$/.test(e.id)), [entradas])

  /* Num telemóvel a semana é uma coluna comprida. A fita marca hoje;
     abrir já em hoje é o que se faz com um marcador de livro. */
  const jaAbriu = useRef(false)
  useEffect(() => {
    if (jaAbriu.current || hoje < 2) return
    jaAbriu.current = true
    if (!window.matchMedia('(max-width: 63.99rem)').matches) return
    const alvo = document.getElementById(`dia-${hoje}`)?.closest('.dia')
    alvo?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [hoje])

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
        inicio={inicio}
        aoRecuar={() => definirInicio(d => mover7(d, -1))}
        aoAvancar={() => definirInicio(d => mover7(d, 1))}
        aoHoje={() => definirInicio(inicioDaSemana())}
        naSemanaCorrente={hoje >= 0}
      />

      {temExemplo && (
        <p className="aviso" role="note">
          <span className="aviso-selo impresso">Exemplo</span>
          <span>
            Isto é conteúdo de exemplo, não são dados de ninguém. Escreva por cima para
            o substituir.
          </span>
          <button type="button" className="aviso-repor impresso" onClick={repor}>
            Repor o exemplo
          </button>
        </p>
      )}

      {falhouAoGuardar && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Não guardado</span>
          <span>
            Este dispositivo não deixa guardar a semana. O que escrever fica visível
            agora, mas desaparece ao fechar o separador.
          </span>
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
