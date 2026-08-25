import { useMemo } from 'react'
import type { Vista } from './Concha'
import { useEmenta } from '../dominio/ementa'
import { useSemana } from '../dominio/estado'
import { chaveDaSemana, DIAS, indiceDeHoje, inicioDaSemana } from '../dominio/semana'
import { tintaDe, type Casa, type Compra, type Entrada } from '../dominio/tipos'
import { ICalendario, ICesto, ILivro, IMoeda, ITalheres, iconeDePrato } from './Icones'

const saudacaoDaHora = () => {
  const h = new Date().getHours()
  return h < 6 ? 'Boa noite' : h < 13 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite'
}

/** A página em si, sem servidor: é isto que se vê e é isto que se ensaia. */
export function PaginaInicio({ hoje, jantar, porComprar, deHoje, nPratos, aoIr }: {
  hoje: number
  jantar: Entrada | null
  porComprar: Compra[]
  deHoje: Entrada[]
  nPratos: number
  aoIr: (v: Vista) => void
}) {
  const IconeJantar = iconeDePrato(jantar?.texto ?? '')
  const dataLonga = new Intl.DateTimeFormat('pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date())

  return (
    <main className="pagina">
      <h2 className="saudacao">{saudacaoDaHora()}.</h2>
      <p className="saudacao-dia">{dataLonga}</p>

      <div className="bento">
        <button type="button" className="modulo modulo--tocavel bento-2 com-cor" style={{ '--cor': 'var(--c-ementa)' } as React.CSSProperties} onClick={() => aoIr('ementa')}>
          <span className="modulo-cabeca">
            <span className="tile">{jantar?.texto ? <IconeJantar /> : <ITalheres />}</span>
            <h3 className="modulo-titulo">O jantar de hoje</h3>
            <span className="modulo-meta">{DIAS[hoje >= 0 ? hoje : 0]}</span>
          </span>
          {jantar?.texto ? (
            <>
              <p className="modulo-destaque">{jantar.texto}</p>
              <p className="modulo-nota">Marcado na ementa desta semana.</p>
            </>
          ) : (
            <>
              <p className="modulo-destaque" style={{ color: 'var(--tinta-3)' }}>Por decidir</p>
              <p className="modulo-nota">Toque para escolher — os ingredientes entram sozinhos na lista.</p>
            </>
          )}
        </button>

        <button type="button" className="modulo modulo--tocavel bento-2 com-cor" style={{ '--cor': 'var(--c-lista)' } as React.CSSProperties} onClick={() => aoIr('ementa')}>
          <span className="modulo-cabeca">
            <span className="tile"><ICesto /></span>
            <h3 className="modulo-titulo">A lista</h3>
            <span className="modulo-meta modulo-numero">
              {porComprar.length === 0 ? 'em dia' : `${porComprar.length} por comprar`}
            </span>
          </span>
          {porComprar.length > 0 ? (
            <ul className="amostra">
              {porComprar.slice(0, 3).map(c => (
                <li key={c.id}>
                  <span className="amostra-texto">{c.nome}</span>
                  {c.quantidade && <span className="amostra-hora">{c.quantidade}</span>}
                </li>
              ))}
              {porComprar.length > 3 && (
                <li><span className="amostra-texto" style={{ color: 'var(--tinta-3)' }}>e mais {porComprar.length - 3}…</span></li>
              )}
            </ul>
          ) : (
            <p className="modulo-nota">Nada por comprar. A lista da semana faz-se dos jantares e do que se escrever.</p>
          )}
        </button>

        <button type="button" className="modulo modulo--tocavel bento-2 com-cor" style={{ '--cor': 'var(--c-semana)' } as React.CSSProperties} onClick={() => aoIr('semana')}>
          <span className="modulo-cabeca">
            <span className="tile"><ICalendario /></span>
            <h3 className="modulo-titulo">Hoje na semana</h3>
            <span className="modulo-meta modulo-numero">{deHoje.length === 0 ? 'sem nada marcado' : `${deHoje.length} na agenda`}</span>
          </span>
          {deHoje.length > 0 ? (
            <ul className="amostra">
              {deHoje.map(x => (
                <li key={x.id}>
                  <span className="amostra-ponto" style={{ background: tintaDe(x.autor) }} />
                  <span className="amostra-texto">{x.texto}</span>
                  {x.hora && <span className="amostra-hora">{x.hora}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="modulo-nota">Um dia livre. A semana inteira está a um toque.</p>
          )}
        </button>

        <button type="button" className="modulo modulo--tocavel com-cor" style={{ '--cor': 'var(--c-livro)' } as React.CSSProperties} onClick={() => aoIr('livro')}>
          <span className="modulo-cabeca">
            <span className="tile"><ILivro /></span>
            <h3 className="modulo-titulo">O livro</h3>
          </span>
          <p className="modulo-nota modulo-numero">
            {nPratos === 0 ? 'Ainda em branco — escreva os pratos da casa.'
              : nPratos === 1 ? '1 prato da casa.'
              : `${nPratos} pratos da casa.`}
          </p>
        </button>

        <div className="modulo modulo--tocavel modulo--mudo com-cor" style={{ '--cor': 'var(--c-financas)' } as React.CSSProperties} role="note">
          <span className="modulo-cabeca">
            <span className="tile"><IMoeda /></span>
            <h3 className="modulo-titulo">Finanças</h3>
            <span className="modulo-meta">em breve</span>
          </span>
          <p className="modulo-nota">As contas da casa vão viver aqui.</p>
        </div>
      </div>
    </main>
  )
}


/** O contentor: liga o Início ao que está no servidor. */
export function Inicio({ casa, aoIr }: { casa: Casa; aoIr: (v: Vista) => void }) {
  const inicio = inicioDaSemana()
  const chave = chaveDaSemana(inicio)
  const hoje = indiceDeHoje(inicio)
  const e = useEmenta(casa.id, chave)
  const s = useSemana(casa.id, chave)

  const jantar = hoje >= 0 ? e.jantarDe(hoje) : null
  const porComprar = useMemo(() => e.compras.filter(c => !c.comprado), [e.compras])
  const deHoje = useMemo(
    () => s.entradas
      .filter(x => x.dia === hoje && !x.riscada && x.genero !== 'refeicao')
      .sort((a, b) => (a.hora ?? '99').localeCompare(b.hora ?? '99'))
      .slice(0, 4),
    [s.entradas, hoje],
  )

  return (
    <PaginaInicio
      hoje={hoje}
      jantar={jantar}
      porComprar={porComprar}
      deHoje={deHoje}
      nPratos={e.pratos.length}
      aoIr={aoIr}
    />
  )
}
