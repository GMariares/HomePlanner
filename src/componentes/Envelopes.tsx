import { useState, type CSSProperties } from 'react'
import type { Categoria, Compromisso, Envelope, Movimento } from '../dominio/financas'
import { escreverEuros, lerCents } from '../dominio/dinheiro'
import { Visto } from './Marcar'
import { IPontos } from './Icones'
import { Menu } from './Menu'
import { iconeDeCategoria } from './IconesFinancas'

/** Um envelope: o que já saiu contra o tecto, e quanto falta rebentar. */
function Fila({ e, aoDefinirLimite }: {
  e: Envelope
  aoDefinirLimite: (id: string, cents: number | null) => void
}) {
  const [aEditar, definirAEditar] = useState(false)
  const [texto, definirTexto] = useState(e.limite != null ? String(e.limite / 100).replace('.', ',') : '')
  const Icone = iconeDeCategoria(e.categoria.icone)

  const cheio = e.limite && e.limite > 0 ? Math.min(100, (e.gasto / e.limite) * 100) : 0
  const rebentou = e.limite != null && e.gasto > e.limite
  const resta = e.limite != null ? e.limite - e.gasto : null

  const guardar = () => {
    definirAEditar(false)
    aoDefinirLimite(e.categoria.id, lerCents(texto))
  }

  return (
    <div
      className="envelope com-cor"
      style={{ '--cor': e.categoria.cor } as CSSProperties}
      data-rebentou={rebentou || undefined}
    >
      <span className="tile envelope-tile" aria-hidden="true"><Icone /></span>

      <span className="envelope-corpo">
        <span className="envelope-cabeca">
          <span className="envelope-nome">{e.categoria.nome}</span>
          <span className="envelope-valor">{escreverEuros(e.gasto)}</span>
        </span>

        <span className="envelope-barra" aria-hidden="true">
          <span className="envelope-cheio" style={{ width: `${cheio}%` }} />
        </span>

        <span className="envelope-pe">
          {aEditar ? (
            <input
              className="campo-escrita envelope-limite"
              value={texto}
              autoFocus
              onChange={ev => definirTexto(ev.target.value)}
              onBlur={guardar}
              onKeyDown={ev => { if (ev.key === 'Enter') guardar(); if (ev.key === 'Escape') definirAEditar(false) }}
              inputMode="decimal"
              aria-label={`Tecto de ${e.categoria.nome}`}
              placeholder="sem tecto"
            />
          ) : (
            <button type="button" className="botao-texto envelope-tecto" onClick={() => definirAEditar(true)}>
              {e.limite == null
                ? 'pôr um tecto'
                : rebentou
                  ? `passou ${escreverEuros(e.gasto - e.limite)}`
                  : `faltam ${escreverEuros(resta ?? 0)}`}
            </button>
          )}
          <span className="envelope-conta">
            {e.quantos === 0 ? 'sem movimentos' : e.quantos === 1 ? '1 movimento' : `${e.quantos} movimentos`}
          </span>
        </span>
      </span>
    </div>
  )
}

export function Envelopes({ envelopes, aoDefinirLimite }: {
  envelopes: Envelope[]
  aoDefinirLimite: (id: string, cents: number | null) => void
}) {
  if (envelopes.length === 0) return null
  return (
    <section className="modulo" aria-labelledby="envelopes-titulo">
      <header className="dia-cabeca">
        <h3 id="envelopes-titulo" className="dia-nome">Os envelopes</h3>
        <span className="dia-data">o que é variável</span>
      </header>
      <div className="envelopes">
        {envelopes.map(e => (
          <Fila key={e.categoria.id} e={e} aoDefinirLimite={aoDefinirLimite} />
        ))}
      </div>
    </section>
  )
}

/**
 * O comprometido — fora dos envelopes de propósito.
 *
 * A renda não compete com o mercado, e o ritmo do mês só faz sentido sobre
 * o que ainda se pode decidir. Aqui só se vê o que já está prometido e o
 * que falta pagar.
 */
export function Comprometido({ compromissos, pagamentos, categorias, comprometido, porPagar, aoPagar }: {
  compromissos: Compromisso[]
  pagamentos: Map<string, Movimento>
  categorias: Map<string, Categoria>
  comprometido: number
  porPagar: number
  aoPagar: (c: Compromisso, pago: boolean) => void
}) {
  if (compromissos.length === 0) return null
  const hoje = new Date().getDate()

  return (
    <section className="modulo" aria-labelledby="comprometido-titulo">
      <header className="dia-cabeca">
        <h3 id="comprometido-titulo" className="dia-nome">Já prometido</h3>
        <span className="dia-data modulo-numero">
          {porPagar === 0 ? 'está tudo pago' : `${escreverEuros(porPagar)} por pagar`}
        </span>
      </header>

      {compromissos
        .slice()
        .sort((a, b) => a.dia_do_mes - b.dia_do_mes)
        .map(c => {
          const pago = pagamentos.get(c.id)
          const atrasado = !pago && c.dia_do_mes < hoje
          const cor = c.categoria_id ? categorias.get(c.categoria_id)?.cor : undefined
          return (
            <div className="fila com-cor" key={c.id} style={{ '--cor': cor ?? 'var(--c-financas)' } as CSSProperties}
              data-feita={pago ? true : undefined}>
              <Visto
                feita={Boolean(pago)}
                aoAlternar={() => aoPagar(c, !pago)}
                rotulo={`Marcar ${c.nome} como pago`}
              />
              <span className="fila-corpo">
                <span className="fila-nome">{c.nome}</span>
                <span className="fila-meta">
                  <span>dia {c.dia_do_mes}</span>
                  {c.fornecedor && <span>{c.fornecedor}</span>}
                  {atrasado && <span className="compromisso-atraso">em atraso</span>}
                </span>
              </span>
              <span className="fila-numero">{escreverEuros(c.valor_cents)}</span>
            </div>
          )
        })}

      <p className="total-fila">
        <span className="total-nome">Todos os meses</span>
        <strong className="total-valor">{escreverEuros(comprometido)}</strong>
        <span className="total-nota">fora dos envelopes: não entra no passo do mês</span>
      </p>
    </section>
  )
}

/** As últimas linhas do mês, com o que se pode corrigir à mão. */
export function Livro({ movimentos, categorias, aoApagar, aoMudarMes }: {
  movimentos: Movimento[]
  categorias: Map<string, Categoria>
  aoApagar: (id: string) => void
  aoMudarMes: (m: Movimento) => void
}) {
  return (
    <section className="modulo" aria-labelledby="livro-titulo">
      <header className="dia-cabeca">
        <h3 id="livro-titulo" className="dia-nome">O que passou</h3>
        <span className="dia-data modulo-numero">
          {movimentos.length === 0 ? 'nada ainda' : `${movimentos.length} movimentos`}
        </span>
      </header>

      {movimentos.length === 0 && (
        <p className="vazio">Registe um gasto na linha de cima, ou traga um extracto do banco.</p>
      )}

      {movimentos
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .map(m => {
          const cat = m.categoria_id ? categorias.get(m.categoria_id) : null
          const entrada = m.valor_cents > 0
          const noutroMes = Boolean(m.mes_conta_manual)
          return (
            <div className="fila com-cor" key={m.id}
              style={{ '--cor': cat?.cor ?? 'var(--c-financas)' } as CSSProperties}>
              <span className="fila-corpo">
                <span className="fila-nome">{m.descricao || 'sem descrição'}</span>
                <span className="fila-meta">
                  <span>{m.data.slice(8, 10)}/{m.data.slice(5, 7)}</span>
                  {cat && <span className="movimento-cat">{cat.nome}</span>}
                  {m.fornecedor && <span>{m.fornecedor}</span>}
                  {noutroMes && <span className="movimento-mes">contado neste mês</span>}
                </span>
              </span>
              <span className="fila-numero" data-entrada={entrada || undefined}>
                {entrada ? '+' : ''}{escreverEuros(m.valor_cents)}
              </span>
              <Menu
                titulo={m.descricao || 'este movimento'}
                alinhar="direita"
                opcoes={[
                  {
                    id: 'mes',
                    rotulo: noutroMes ? 'Contar no mês da data' : 'Contar noutro mês',
                    aoEscolher: () => aoMudarMes(m),
                  },
                  { id: 'apagar', rotulo: 'Apagar', tinta: 'var(--perigo)', aoEscolher: () => aoApagar(m.id) },
                ]}
                gatilho={({ abrir, refs, controla, aberto }) => (
                  <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                    aria-expanded={aberto} aria-controls={controla} className="botao-gelo">
                    <span className="sr-only">O que fazer a {m.descricao || 'este movimento'}</span>
                    <IPontos />
                  </button>
                )}
              />
            </div>
          )
        })}
    </section>
  )
}
