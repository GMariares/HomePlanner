import { useState } from 'react'
import type { Compra } from '../dominio/tipos'
import { CampoDeCarimbo } from './Carimbo'
import { Escrita } from './Escrita'
import { Reticencias } from './Icones'

/** A lista da semana. O que não se comprou não desaparece: passa à frente. */
export function ListaCompras({ compras, semana, porComprar, aoAlternar, aoAlterar, aoAcrescentar, aoApagar }: {
  compras: Compra[]
  semana: string
  porComprar: number
  aoAlternar: (c: Compra) => void
  aoAlterar: (c: Compra, mudanca: Partial<Compra>) => void
  aoAcrescentar: (nome: string, quantidade: string | null) => void
  aoApagar: (id: string) => void
}) {
  const [nome, definirNome] = useState('')
  const [qtd, definirQtd] = useState('')

  const guardar = () => {
    if (!nome.trim()) return
    aoAcrescentar(nome.trim(), qtd.trim() || null)
    definirNome(''); definirQtd('')
  }

  return (
    <section className="lista-compras" aria-labelledby="compras-titulo">
      <header className="dia-cabecalho">
        <h2 id="compras-titulo" className="dia-nome">A lista</h2>
        <span className="dia-data impresso">
          {porComprar === 0 ? 'está tudo comprado' : `${porComprar} por comprar`}
        </span>
      </header>

      <div className="dia-corpo pauta margem">
        {compras.map(c => {
          const doutraSemana = !c.comprado && c.semana !== semana
          return (
            <div className="linha linha--compra" key={c.id} data-feita={c.comprado || undefined}>
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
                  aria-label={`Quantidade de ${c.nome}`}
                  onChange={e => aoAlterar(c, { quantidade: e.target.value })}
                />
              </span>
              <span className="linha-carimbo">
                <CampoDeCarimbo
                  feita={c.comprado}
                  aoAlternar={() => aoAlternar(c)}
                  rotulo={`Marcar ${c.nome} como comprado`}
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

        <div className="linha linha--compra linha--branco">
          <span className="linha-goteira" />
          <span className="linha-corpo">
            <Escrita
              valor={nome}
              rotulo="Escrever uma coisa para comprar"
              aoMudar={definirNome}
              aoTerminar={guardar}
              aoConfirmar={guardar}
            />
          </span>
          <span className="linha-hora">
            <input
              className="escrita escrita--hora"
              value={qtd}
              placeholder="qt."
              aria-label="Quantidade"
              onChange={e => definirQtd(e.target.value)}
              onBlur={guardar}
            />
          </span>
          <span className="linha-carimbo" />
          <span className="linha-accoes" />
        </div>
      </div>
    </section>
  )
}
