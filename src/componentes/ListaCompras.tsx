import { useState, type CSSProperties } from 'react'
import type { Compra, Artigo, Conjunto } from '../dominio/tipos'
import { Visto } from './Marcar'
import { Escrita } from './Escrita'
import { IPontos } from './Icones'
import { LinhaNova } from './LinhaNova'
import { CampoPreco } from './CampoPreco'

const EUROS = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' })

/** A lista da semana. O que não se comprou não desaparece: passa à frente. */
export function ListaCompras({
  compras, semana, porComprar, total, artigos, conjuntos, mostrarPrecos, podePrecos = true,
  aoAlternar, aoAlterar, aoAcrescentar, aoApagar, aoAplicarConjunto, aoMostrarPrecos,
}: {
  compras: Compra[]
  semana: string
  porComprar: number
  total: number
  artigos: Artigo[]
  conjuntos: Conjunto[]
  mostrarPrecos: boolean
  podePrecos?: boolean
  aoAlternar: (c: Compra) => void
  aoAlterar: (c: Compra, mudanca: Partial<Compra>) => void
  aoAcrescentar: (nome: string, quantidade: string | null, preco: number | null) => void
  aoApagar: (id: string) => void
  aoAplicarConjunto: (c: Conjunto) => Promise<number> | void
  aoMostrarPrecos: (v: boolean) => void
}) {
  const [recado, definirRecado] = useState<string | null>(null)
  const [esconderFeitas, definirEsconderFeitas] = useState(false)

  const feitas = compras.filter(c => c.comprado)
  /* No corredor a lista só cresce: esconder o que está no cesto é a
     diferença entre ler cinquenta linhas e ler as doze que faltam. */
  const visiveis = esconderFeitas ? compras.filter(c => !c.comprado) : compras
  const gasto = feitas.reduce((soma, c) => soma + (c.preco ?? 0), 0)

  /* Uma quantidade cortada é uma compra errada: a coluna dos números
     abre-se ao que lá está escrito, e é o nome que cede a medida. */
  const maiorQtd = compras.reduce((n, c) => Math.max(n, (c.quantidade ?? '').length), 0)
  const medida = {
    '--cor': 'var(--c-lista)',
    '--qtd-ch': maiorQtd,
  } as CSSProperties

  const juntar = async (c: Conjunto) => {
    const quantas = await aoAplicarConjunto(c)
    if (typeof quantas !== 'number') return
    definirRecado(
      quantas === 0 ? `“${c.nome}” já estava tudo na lista.`
      : quantas === 1 ? `“${c.nome}” acrescentou 1 coisa.`
      : `“${c.nome}” acrescentou ${quantas} coisas.`,
    )
    setTimeout(() => definirRecado(null), 4000)
  }

  return (
    <section className="modulo com-cor" style={medida} aria-labelledby="compras-titulo">
      <header className="dia-cabeca dia-cabeca--lista">
        <h3 id="compras-titulo" className="dia-nome">A lista</h3>
        <span className="dia-data modulo-numero">
          {compras.length === 0 ? 'ainda sem nada'
            : porComprar === 0 ? 'está tudo comprado'
            : `${porComprar} por comprar`}
        </span>
        <span className="lista-accoes">
          {podePrecos && (
            <button type="button" className="botao-texto" onClick={() => aoMostrarPrecos(!mostrarPrecos)}>
              {mostrarPrecos ? 'esconder preços' : 'pôr preços'}
            </button>
          )}
          {feitas.length > 0 && (
            <button type="button" className="botao-texto"
              aria-pressed={esconderFeitas}
              onClick={() => definirEsconderFeitas(v => !v)}>
              {esconderFeitas
                ? `mostrar ${feitas.length === 1 ? 'a comprada' : `as ${feitas.length} compradas`}`
                : 'esconder as compradas'}
            </button>
          )}
        </span>
      </header>

      {conjuntos.length > 0 && (
        <div className="chips lista-conjuntos">
          {conjuntos.map(c => (
            <button key={c.id} type="button" className="chip" onClick={() => juntar(c)}>
              {c.nome}
              <span className="chip-conta">{c.itens.length}</span>
            </button>
          ))}
        </div>
      )}

      {recado && <p className="lista-recado" role="status">{recado}</p>}

      {compras.length === 0 && (
        <p className="vazio">
          Escreva na linha — ou marque um jantar, e os ingredientes vêm sozinhos.
        </p>
      )}

      <div className="lista-filas">
        {visiveis.map(c => {
          const doutraSemana = !c.comprado && c.semana !== semana
          return (
            <div className="fila" key={c.id} data-feita={c.comprado || undefined}>
              <Visto
                feita={c.comprado}
                aoAlternar={() => aoAlternar(c)}
                rotulo={`Marcar ${c.nome} como comprado`}
              />
              <span className="fila-corpo">
                <Escrita
                  valor={c.nome}
                  rotulo="O que é preciso comprar"
                  aoMudar={nome => aoAlterar(c, { nome })}
                />
                {(c.prato_nome || doutraSemana) && (
                  <span className="fila-meta">
                    {c.prato_nome && <span className="fila-origem">{c.prato_nome}</span>}
                    {doutraSemana && <span className="fila-atrasada">da semana passada</span>}
                  </span>
                )}
              </span>
              <input
                className="escrita escrita--num escrita--qtd"
                value={c.quantidade ?? ''}
                placeholder="qt."
                maxLength={24}
                aria-label={`Quantidade de ${c.nome}`}
                onChange={e => aoAlterar(c, { quantidade: e.target.value })}
              />
              {mostrarPrecos && (
                <CampoPreco
                  valor={c.preco}
                  rotulo={`Preço de ${c.nome}`}
                  aoMudar={preco => aoAlterar(c, { preco })}
                />
              )}
              <button type="button" className="botao-gelo" onClick={() => aoApagar(c.id)}>
                <span className="sr-only">Apagar {c.nome} da lista</span>
                <IPontos />
              </button>
            </div>
          )
        })}

        <LinhaNova artigos={artigos} mostrarPreco={mostrarPrecos} aoAcrescentar={aoAcrescentar} />
      </div>

      {mostrarPrecos && (total > 0 || gasto > 0) && (
        <p className="total-fila">
          <span className="total-nome">Por comprar</span>
          <strong className="total-valor">{EUROS.format(total)}</strong>
          {gasto > 0 && (
            <>
              <span className="total-nome">No cesto</span>
              <strong className="total-valor total-valor--cesto">{EUROS.format(gasto)}</strong>
            </>
          )}
          <span className="total-nota">só conta o que tem preço escrito</span>
        </p>
      )}
    </section>
  )
}
