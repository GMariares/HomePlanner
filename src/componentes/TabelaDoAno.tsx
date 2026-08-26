import { useState, type CSSProperties } from 'react'
import type { Ano, LinhaDoAno } from '../dominio/financas'
import { escreverEuros } from '../dominio/dinheiro'
import { ISetaDir } from './Icones'
import { iconeDeCategoria } from './IconesFinancas'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/** "1 234" — na tabela do ano os cêntimos são ruído; a folga é informação. */
const curto = (cents: number) =>
  cents === 0 ? '' : new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(Math.round(cents / 100)).replace('-', '−')

/** A média de uma linha divide-se pelos meses em que ela existiu. */
const media = (total: number, meses: number) => (meses === 0 ? 0 : Math.round(total / meses))

function Linha({ l, funda = false }: { l: LinhaDoAno; funda?: boolean }) {
  const [aberta, definirAberta] = useState(false)
  const Icone = iconeDeCategoria(l.categoria.icone)
  const temFilhos = Boolean(l.filhos?.length)

  return (
    <>
      <tr className={funda ? 'ano-linha ano-linha--funda' : 'ano-linha'}
        style={{ '--cor': l.categoria.cor } as CSSProperties}>
        <th scope="row" className="ano-nome">
          {funda ? (
            <span className="ano-nome-texto">{l.categoria.nome}</span>
          ) : temFilhos ? (
            <button type="button" className="ano-abrir" aria-expanded={aberta}
              onClick={() => definirAberta(v => !v)}>
              <span className="tile ano-tile com-cor" style={{ '--cor': l.categoria.cor } as CSSProperties} aria-hidden="true"><Icone lado={14} /></span>
              <span className="ano-nome-texto">{l.categoria.nome}</span>
              <span className="ano-seta" data-aberta={aberta || undefined} aria-hidden="true"><ISetaDir lado={12} /></span>
            </button>
          ) : (
            <span className="ano-abrir">
              <span className="tile ano-tile com-cor" style={{ '--cor': l.categoria.cor } as CSSProperties} aria-hidden="true"><Icone lado={14} /></span>
              <span className="ano-nome-texto">{l.categoria.nome}</span>
            </span>
          )}
        </th>
        {l.meses.map((v, i) => (
          <td key={i} className="ano-valor" data-vazio={v === 0 || undefined}>{curto(v)}</td>
        ))}
        <td className="ano-valor ano-total">{curto(l.total)}</td>
        <td className="ano-valor ano-media">{curto(media(l.total, l.mesesComMovimento))}</td>
      </tr>
      {aberta && l.filhos?.map(f => (
        <Linha key={f.categoria.id} l={f} funda />
      ))}
    </>
  )
}

function LinhaTotal({ nome, meses }: { nome: string; meses: number[] }) {
  const total = meses.reduce((s, v) => s + v, 0)
  const activos = meses.filter(v => v !== 0).length
  return (
    <tr className="ano-linha ano-linha--soma">
      <th scope="row" className="ano-nome"><span className="ano-nome-texto">{nome}</span></th>
      {meses.map((v, i) => <td key={i} className="ano-valor" data-vazio={v === 0 || undefined}>{curto(v)}</td>)}
      <td className="ano-valor ano-total">{curto(total)}</td>
      <td className="ano-valor ano-media">{curto(media(total, activos))}</td>
    </tr>
  )
}

/**
 * O ano à vista — a folha que a família já tinha, com as contas feitas.
 *
 * Categorias nas linhas, meses nas colunas, total e média à direita. Uma
 * categoria com partes abre-se na própria tabela. Aqui entram TODOS os
 * movimentos, os dos compromissos incluídos: isto é o relatório do que
 * aconteceu, não o corredor do que ainda se decide.
 *
 * A média divide pelos meses em que a linha teve movimento. Pelos meses do
 * calendário, uma casa que começou a meio do ano via todas as suas médias
 * a metade — uma resposta errada com ar de resposta certa.
 */
export function TabelaDoAno({ ano, dados }: { ano: number; dados: Ano }) {
  const { despesas, entradas, totalDespesa, totalEntrada, transferencias } = dados
  const vazio = despesas.length === 0 && entradas.length === 0
  const poupanca = totalEntrada.map((v, i) => v - totalDespesa[i])

  return (
    <section className="modulo ano" aria-labelledby="ano-titulo">
      <header className="dia-cabeca dia-cabeca--lista">
        <h3 id="ano-titulo" className="dia-nome">{ano} à vista</h3>
        <span className="dia-data">média dos meses com movimento</span>
      </header>

      {vazio ? (
        <p className="vazio">Ainda não há movimentos em {ano}. O ano escreve-se sozinho à medida que o mês passa.</p>
      ) : (
        <><div className="ano-rolo">
          <table className="ano-tabela">
            <thead>
              <tr>
                <th scope="col" className="ano-nome ano-cabeca"><span className="sr-only">Categoria</span></th>
                {MESES.map((m, i) => <th key={m} scope="col" className="ano-valor ano-cabeca" data-mes={i}>{m}</th>)}
                <th scope="col" className="ano-valor ano-cabeca ano-total">Total</th>
                <th scope="col" className="ano-valor ano-cabeca ano-media">Média</th>
              </tr>
            </thead>
            {despesas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Despesa</th></tr>
                {despesas.map(l => <Linha key={l.categoria.id} l={l} />)}
                <LinhaTotal nome="Toda a despesa" meses={totalDespesa} />
              </tbody>
            )}
            {entradas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Entrada</th></tr>
                {entradas.map(l => <Linha key={l.categoria.id} l={l} />)}
                <LinhaTotal nome="Tudo o que entrou" meses={totalEntrada} />
              </tbody>
            )}
            {despesas.length > 0 && entradas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Balanço</th></tr>
                <LinhaTotal nome="O que sobrou" meses={poupanca} />
              </tbody>
            )}
          </table>
        </div>
        <AnoEmLista despesas={despesas} entradas={entradas} totalDespesa={totalDespesa}
          totalEntrada={totalEntrada} poupanca={poupanca} />
        </>
      )}

      <p className="ano-nota">
        valores em euros, sem cêntimos · com os compromissos incluídos ·
        Média divide pelos meses com movimento
        {transferencias > 0 && (transferencias === 1
          ? ' · 1 transferência entre contas ficou de fora'
          : ` · ${transferencias} transferências entre contas ficaram de fora`)}
      </p>
      <p className="sr-only">
        Despesa do ano: {escreverEuros(totalDespesa.reduce((s, v) => s + v, 0))}.
        Entrada do ano: {escreverEuros(totalEntrada.reduce((s, v) => s + v, 0))}.
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */

const INICIAIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

/**
 * Uma linha do ano, num telemóvel: doze barras em vez de doze colunas.
 *
 * Quinze colunas não cabem em 390px, e a tabela rolada de lado abria com
 * zero meses à vista — um ano invisível. Aqui a linha diz a forma do ano
 * de uma vez: onde foi alto, onde foi baixo, onde não houve nada. O número
 * exacto de um mês vive na vista do mês, que é onde se vai buscá-lo.
 */
function Faixa({ l, funda = false, soma = false }: { l: LinhaDoAno; funda?: boolean; soma?: boolean }) {
  const [aberta, definirAberta] = useState(false)
  const Icone = iconeDeCategoria(l.categoria.icone)
  const temFilhos = Boolean(l.filhos?.length)
  const maior = Math.max(...l.meses.map(v => Math.abs(v)), 1)

  const corpo = (
    <>
      <span className="anol-cabeca">
        {/* Uma soma não é uma categoria e não usa azulejo: a 14px o saco
            lia-se como um cadeado. */}
        {!funda && !soma && (
          <span className="tile ano-tile com-cor" style={{ '--cor': l.categoria.cor } as CSSProperties} aria-hidden="true">
            <Icone lado={14} />
          </span>
        )}
        <span className="anol-nome">{l.categoria.nome}</span>
        {temFilhos && (
          <span className="ano-seta" data-aberta={aberta || undefined} aria-hidden="true"><ISetaDir lado={12} /></span>
        )}
        <span className="anol-total">{curto(l.total)}</span>
      </span>
      <span className="anol-meses" aria-hidden="true">
        {l.meses.map((v, i) => (
          <span className="anol-mes" key={i}>
            <span className="anol-tubo">
              <span
                className="anol-barra"
                data-negativo={v < 0 || undefined}
                style={{ height: v === 0 ? 0 : `${Math.max(8, Math.round((Math.abs(v) / maior) * 100))}%` }}
              />
            </span>
            <span className="anol-inicial">{INICIAIS[i]}</span>
          </span>
        ))}
      </span>
      <span className="anol-media">
        média {curto(media(l.total, l.mesesComMovimento))} € em {l.mesesComMovimento === 1 ? '1 mês' : `${l.mesesComMovimento} meses`}
      </span>
    </>
  )

  return (
    <>
      <div className="anol-linha com-cor" style={{ '--cor': l.categoria.cor } as CSSProperties}
        data-funda={funda || undefined} data-soma={soma || undefined}>
        {temFilhos ? (
          <button type="button" className="anol-botao" aria-expanded={aberta} onClick={() => definirAberta(v => !v)}>
            {corpo}
          </button>
        ) : (
          <span className="anol-botao">{corpo}</span>
        )}
        <span className="sr-only">
          {l.categoria.nome}: {escreverEuros(l.total)} no ano, em {l.mesesComMovimento === 1 ? '1 mês' : `${l.mesesComMovimento} meses`}.
        </span>
      </div>
      {aberta && l.filhos?.map(f => <Faixa key={f.categoria.id} l={f} funda />)}
    </>
  )
}

function AnoEmLista({ despesas, entradas, totalDespesa, totalEntrada, poupanca }: {
  despesas: LinhaDoAno[]
  entradas: LinhaDoAno[]
  totalDespesa: number[]
  totalEntrada: number[]
  poupanca: number[]
}) {
  const soma = (nome: string, meses: number[], cor: string): LinhaDoAno => ({
    categoria: { id: nome, nome, natureza: 'despesa', cor, icone: 'saco', limite_cents: null, ordem: 0, arquivada: false },
    meses,
    total: meses.reduce((s, v) => s + v, 0),
    mesesComMovimento: meses.filter(v => v !== 0).length,
  })

  return (
    <div className="ano-lista">
      {despesas.length > 0 && (
        <>
          <p className="campo-nome anol-seccao">Despesa</p>
          {despesas.map(l => <Faixa key={l.categoria.id} l={l} />)}
          <Faixa l={soma('Toda a despesa', totalDespesa, 'var(--tinta)')} soma />
        </>
      )}
      {entradas.length > 0 && (
        <>
          <p className="campo-nome anol-seccao">Entrada</p>
          {entradas.map(l => <Faixa key={l.categoria.id} l={l} />)}
          <Faixa l={soma('Tudo o que entrou', totalEntrada, 'var(--c-ementa)')} soma />
        </>
      )}
      {despesas.length > 0 && entradas.length > 0 && (
        <>
          <p className="campo-nome anol-seccao">Balanço</p>
          <Faixa l={soma('O que sobrou', poupanca, 'var(--c-financas)')} soma />
        </>
      )}
    </div>
  )
}
