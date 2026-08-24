import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Compra, Artigo, Conjunto } from '../dominio/tipos'
import { CampoDeCarimbo } from './Carimbo'
import { Escrita } from './Escrita'
import { Reticencias } from './Icones'
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
  /* No corredor a lista só cresce, e o que já está no cesto rouba o lugar ao
     que falta. Esconder o que está comprado é a diferença entre ler cinquenta
     linhas e ler as doze que interessam. */
  const visiveis = esconderFeitas ? compras.filter(c => !c.comprado) : compras
  const gasto = feitas.reduce((soma, c) => soma + (c.preco ?? 0), 0)

  /* Uma quantidade cortada é uma compra errada. Quando dois pratos pedem
     unidades que não se somam — "500 g + 2 un" — a coluna dos números abre-se
     ao que lá está escrito, e é o nome que cede a medida, não o número. */
  const maiorQtd = compras.reduce((n, c) => Math.max(n, (c.quantidade ?? '').length), 0)
  const medida = { '--qtd-conteudo': `${(maiorQtd * 0.52 + 0.65).toFixed(2)}rem` } as CSSProperties

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
    <section className="lista-compras" aria-labelledby="compras-titulo">
      <header className="dia-cabecalho">
        <h2 id="compras-titulo" className="dia-nome">A lista</h2>
        <span className="dia-data impresso lista-conta">
          <span>
            {compras.length === 0 ? 'ainda sem nada'
              : porComprar === 0 ? 'está tudo comprado'
              : `${porComprar} por comprar`}
          </span>
          {podePrecos && (
            <button type="button" className="aviso-repor impresso" onClick={() => aoMostrarPrecos(!mostrarPrecos)}>
              {mostrarPrecos ? 'esconder preços' : 'pôr preços'}
            </button>
          )}
          {feitas.length > 0 && (
            <button type="button" className="aviso-repor impresso"
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
        <p className="conjuntos-atalho">
          <span className="impresso">Conjuntos</span>
          {conjuntos.map(c => (
            <button key={c.id} type="button" className="conjunto-chip" onClick={() => juntar(c)}>
              {c.nome}
              <span className="impresso conjunto-conta">
                {c.itens.length === 1 ? '1 coisa' : `${c.itens.length} coisas`}
              </span>
            </button>
          ))}
        </p>
      )}

      {recado && <p className="conjunto-recado impresso" role="status">{recado}</p>}

      <div className="dia-corpo pauta margem" style={medida}>
        {mostrarPrecos && (
          <div className="linha linha--compra linha--legenda" data-com-preco aria-hidden="true">
            <span className="linha-goteira" />
            <span className="linha-corpo" />
            <span className="linha-hora impresso">qt.</span>
            <span className="linha-preco impresso">€</span>
            <span className="linha-carimbo" />
            <span className="linha-accoes" />
          </div>
        )}
        {compras.length === 0 && (
          <p className="impresso lista-vazia">
            Escreva na linha — ou marque um jantar, e os ingredientes vêm sozinhos.
          </p>
        )}
        {visiveis.map(c => {
          const doutraSemana = !c.comprado && c.semana !== semana
          return (
            <div className="linha linha--compra" key={c.id}
              data-feita={c.comprado || undefined} data-com-preco={mostrarPrecos || undefined}>
              <span className="linha-goteira" />
              <span className="linha-corpo">
                <Escrita
                  valor={c.nome}
                  rotulo="O que é preciso comprar"
                  cor={c.comprado ? 'var(--impresso-tinta)' : 'var(--casa)'}
                  aoMudar={nome => aoAlterar(c, { nome })}
                />
                {c.prato_nome && <span className="compra-origem impresso">{c.prato_nome}</span>}
                {doutraSemana && <span className="compra-atrasada impresso">de trás</span>}
              </span>
              <span className="linha-hora">
                <input
                  className="escrita escrita--hora"
                  value={c.quantidade ?? ''}
                  placeholder="qt."
                  maxLength={24}
                  aria-label={`Quantidade de ${c.nome}`}
                  onChange={e => aoAlterar(c, { quantidade: e.target.value })}
                />
              </span>
              {mostrarPrecos && (
                <span className="linha-preco">
                  <CampoPreco
                    valor={c.preco}
                    rotulo={`Preço de ${c.nome}`}
                    aoMudar={preco => aoAlterar(c, { preco })}
                  />
                </span>
              )}
              <span className="linha-carimbo">
                <CampoDeCarimbo
                  feita={c.comprado}
                  aoAlternar={() => aoAlternar(c)}
                  rotulo={`Marcar ${c.nome} como comprado`}
                  palavra="COMPRADO"
                />
              </span>
              <span className="linha-accoes">
                <button type="button" className="botao-nu" onClick={() => aoApagar(c.id)}>
                  <span className="sr-only">Apagar {c.nome} da lista</span>
                  <Reticencias />
                </button>
              </span>
            </div>
          )
        })}

        <LinhaNova artigos={artigos} mostrarPreco={mostrarPrecos} aoAcrescentar={aoAcrescentar} />
      </div>

      {mostrarPrecos && (total > 0 || gasto > 0) && (
        <p className="lista-total">
          <span className="impresso">Por comprar</span>
          <strong>{EUROS.format(total)}</strong>
          {gasto > 0 && (
            <>
              <span className="impresso">No cesto</span>
              <strong className="lista-total--cesto">{EUROS.format(gasto)}</strong>
            </>
          )}
          <span className="impresso lista-total-nota">só conta o que tem preço escrito</span>
        </p>
      )}
    </section>
  )
}
