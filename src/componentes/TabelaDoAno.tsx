import { useState, type CSSProperties } from 'react'
import type { Ano, LinhaDoAno } from '../dominio/financas'
import { escreverEuros } from '../dominio/dinheiro'
import { ISetaDir } from './Icones'
import { iconeDeCategoria } from './IconesFinancas'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/** "1 234" — na tabela do ano os cêntimos são ruído; a folga é informação. */
const curto = (cents: number) =>
  cents === 0 ? '' : new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(Math.round(cents / 100))

function Linha({ l, mesesDecorridos, funda = false }: { l: LinhaDoAno; mesesDecorridos: number; funda?: boolean }) {
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
        <td className="ano-valor ano-media">{curto(Math.round(l.total / mesesDecorridos))}</td>
      </tr>
      {aberta && l.filhos?.map(f => (
        <Linha key={f.categoria.id} l={f} mesesDecorridos={mesesDecorridos} funda />
      ))}
    </>
  )
}

function LinhaTotal({ nome, meses, mesesDecorridos }: { nome: string; meses: number[]; mesesDecorridos: number }) {
  const total = meses.reduce((s, v) => s + v, 0)
  return (
    <tr className="ano-linha ano-linha--soma">
      <th scope="row" className="ano-nome"><span className="ano-nome-texto">{nome}</span></th>
      {meses.map((v, i) => <td key={i} className="ano-valor" data-vazio={v === 0 || undefined}>{curto(v)}</td>)}
      <td className="ano-valor ano-total">{curto(total)}</td>
      <td className="ano-valor ano-media">{curto(Math.round(total / mesesDecorridos))}</td>
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
 */
export function TabelaDoAno({ ano, dados }: { ano: number; dados: Ano }) {
  const { despesas, entradas, totalDespesa, totalEntrada, mesesDecorridos, transferencias } = dados
  const vazio = despesas.length === 0 && entradas.length === 0
  const poupanca = totalEntrada.map((v, i) => v - totalDespesa[i])

  return (
    <section className="modulo ano" aria-labelledby="ano-titulo">
      <header className="dia-cabeca">
        <h3 id="ano-titulo" className="dia-nome">{ano} à vista</h3>
        <span className="dia-data">
          média sobre {mesesDecorridos === 1 ? '1 mês' : `${mesesDecorridos} meses`}
        </span>
      </header>

      {vazio ? (
        <p className="vazio">Ainda não há movimentos em {ano}. O ano escreve-se sozinho à medida que o mês passa.</p>
      ) : (
        <div className="ano-rolo">
          <table className="ano-tabela">
            <thead>
              <tr>
                <th scope="col" className="ano-nome ano-cabeca"><span className="sr-only">Categoria</span></th>
                {MESES.map(m => <th key={m} scope="col" className="ano-valor ano-cabeca">{m}</th>)}
                <th scope="col" className="ano-valor ano-cabeca ano-total">Total</th>
                <th scope="col" className="ano-valor ano-cabeca ano-media">Média</th>
              </tr>
            </thead>
            {despesas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Despesa</th></tr>
                {despesas.map(l => <Linha key={l.categoria.id} l={l} mesesDecorridos={mesesDecorridos} />)}
                <LinhaTotal nome="Toda a despesa" meses={totalDespesa} mesesDecorridos={mesesDecorridos} />
              </tbody>
            )}
            {entradas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Entrada</th></tr>
                {entradas.map(l => <Linha key={l.categoria.id} l={l} mesesDecorridos={mesesDecorridos} />)}
                <LinhaTotal nome="Tudo o que entrou" meses={totalEntrada} mesesDecorridos={mesesDecorridos} />
              </tbody>
            )}
            {despesas.length > 0 && entradas.length > 0 && (
              <tbody>
                <tr className="ano-seccao"><th scope="rowgroup" colSpan={15}>Balanço</th></tr>
                <LinhaTotal nome="O que sobrou" meses={poupanca} mesesDecorridos={mesesDecorridos} />
              </tbody>
            )}
          </table>
        </div>
      )}

      <p className="ano-nota">
        valores em euros, sem cêntimos · com os compromissos incluídos ·
        Total soma o ano, Média divide pelos meses decorridos
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
