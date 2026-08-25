import type { CSSProperties } from 'react'
import { IMoeda, ICesto, ICalendario } from './Icones'

/** O lugar das contas está desenhado antes de as contas chegarem:
 *  quem cá vier já sabe o que isto vai ser — e não estranha o sítio. */
export function Financas() {
  return (
    <main className="pagina com-cor" style={{ '--cor': 'var(--c-financas)' } as CSSProperties}>
      <header className="pagina-cabeca">
        <div>
          <h2 className="pagina-titulo">Finanças</h2>
          <p className="pagina-sub">As contas da casa — ainda em obras.</p>
        </div>
      </header>

      <div className="modulo financas-breve">
        <div className="trio" aria-hidden="true">
          <span className="tile tile--grande"><IMoeda lado={26} /></span>
          <span className="tile tile--grande"><ICesto lado={26} /></span>
          <span className="tile tile--grande"><ICalendario lado={26} /></span>
        </div>
        <h3 className="portada-titulo">Em breve, aqui</h3>
        <p className="portada-texto">
          As despesas e as entradas da casa, o orçamento do mês e onde o dinheiro
          vai — por fornecedor e por área. A lista de compras já guarda preços;
          é por aí que isto começa.
        </p>
      </div>
    </main>
  )
}
