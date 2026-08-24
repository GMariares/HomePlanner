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
  aoAplicarConjunto: (c: Conjunto) => void
  aoMostrarPrecos: (v: boolean) => void
}) {
  return (
    <section className="lista-compras" aria-labelledby="compras-titulo">
      <header className="dia-cabecalho">
        <h2 id="compras-titulo" className="dia-nome">A lista</h2>
        <span className="dia-data impresso lista-conta">
          <span>{porComprar === 0 ? 'está tudo comprado' : `${porComprar} por comprar`}</span>
          {podePrecos && (
            <button type="button" className="aviso-repor impresso" onClick={() => aoMostrarPrecos(!mostrarPrecos)}>
              {mostrarPrecos ? 'esconder preços' : 'pôr preços'}
            </button>
          )}
        </span>
      </header>

      {conjuntos.length > 0 && (
        <p className="conjuntos-atalho">
          <span className="impresso">Conjuntos</span>
          {conjuntos.map(c => (
            <button key={c.id} type="button" className="conjunto-chip" onClick={() => aoAplicarConjunto(c)}>
              {c.nome}
              <span className="impresso conjunto-conta">
                {c.itens.length === 1 ? '1 coisa' : `${c.itens.length} coisas`}
              </span>
            </button>
          ))}
        </p>
      )}

      <div className="dia-corpo pauta margem">
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
        {compras.map(c => {
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

      {mostrarPrecos && total > 0 && (
        <p className="lista-total">
          <span className="impresso">Por comprar</span>
          <strong>{EUROS.format(total)}</strong>
          <span className="impresso lista-total-nota">só conta o que tem preço escrito</span>
        </p>
      )}
    </section>
  )
}
