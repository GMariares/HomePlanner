import { useState } from 'react'
import type { Casa } from '../dominio/tipos'
import { chaveDoMes, mesDeChave, nomeDoMes, useFinancas, type Movimento } from '../dominio/financas'
import { escreverEuros } from '../dominio/dinheiro'
import { PistaDoMes } from './PistaDoMes'
import { Comprometido, Envelopes, Livro } from './Envelopes'
import { RegistoRapido } from './RegistoRapido'
import { Importar } from './Importar'
import { ISetaEsq, ISetaDir } from './Icones'

/** O mês seguinte ou o anterior, sem tropeçar em Janeiro. */
const mover = (m: string, n: number) => {
  const d = mesDeChave(m)
  return chaveDoMes(new Date(d.getFullYear(), d.getMonth() + n, 1))
}

export function Financas({ casa }: { casa: Casa }) {
  const [mes, definirMes] = useState(() => chaveDoMes(new Date()))
  const [aImportar, definirAImportar] = useState(false)
  const f = useFinancas(casa.id, mes)
  const esteMes = mes === chaveDoMes(new Date())

  /** O ordenado que entra a 29 de Agosto pode ser o de Setembro. */
  const mudarMes = (m: Movimento) => {
    const natural = `${m.data.slice(0, 7)}-01`
    f.alterarMovimento(m.id, {
      mes_conta_manual: m.mes_conta_manual ? null : mover(natural, 1),
    })
  }

  const pagar = (c: { id: string; nome: string; valor_cents: number; categoria_id: string | null }, pago: boolean) => {
    if (!pago) {
      const ja = f.pagamentos.get(c.id)
      if (ja) f.apagarMovimento(ja.id)
      return
    }
    const d = mesDeChave(mes)
    f.registar({
      data: chaveDoMes(d),
      valor_cents: -Math.abs(c.valor_cents),
      descricao: c.nome,
      categoria_id: c.categoria_id,
      compromisso_id: c.id,
      mes_conta_manual: mes,
    })
  }

  return (
    <main className="pagina">
      <header className="pagina-cabeca">
        <div>
          <h2 className="pagina-titulo">Finanças</h2>
          <p className="pagina-sub pagina-sub--mes">{nomeDoMes(mesDeChave(mes))}</p>
        </div>
        <nav className="semana-nav" aria-label="Meses">
          <button type="button" className="semana-nav-botao" onClick={() => definirMes(m => mover(m, -1))}>
            <ISetaEsq lado={16} />
            <span className="sr-only">Mês anterior</span>
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirMes(chaveDoMes(new Date()))} disabled={esteMes}>
            Este mês
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirMes(m => mover(m, 1))}>
            <ISetaDir lado={16} />
            <span className="sr-only">Mês seguinte</span>
          </button>
        </nav>
      </header>

      {f.estado === 'a-carregar' && (
        <p className="faixa faixa--calma" role="status"><span>A abrir as contas…</span></p>
      )}
      {f.estado === 'sem-migracao' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Falta a sétima migração</span>
          <span>
            Corra <code>supabase/migrations/20260827120000_financas.sql</code> no SQL
            Editor do projecto e recarregue.
          </span>
        </p>
      )}
      {f.estado === 'sem-rede' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem ligação</span>
          <span>Não foi possível ler as contas.</span>
          <button type="button" className="botao-texto" onClick={() => f.recarregar()}>Tentar outra vez</button>
        </p>
      )}
      {f.falhou && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor.</span>
          <button type="button" className="botao-texto"
            onClick={() => { f.limparFalha(); f.recarregar() }}>Tentar outra vez</button>
        </p>
      )}

      {f.estado === 'pronto' && f.categorias.length === 0 ? (
        <section className="modulo financas-primeiro">
          <h3 className="portada-titulo">Ainda não há contas nesta casa</h3>
          <p className="portada-texto">
            Começa-se com uma dúzia de categorias — mercado, casa, contas,
            transportes — que pode mudar, apagar ou acrescentar a qualquer altura.
          </p>
          <button type="button" className="pilula" onClick={() => f.semear()}>
            Começar com as categorias propostas
          </button>
        </section>
      ) : f.estado === 'pronto' || f.movimentos.length > 0 ? (
        <div className="financas">
          <div className="financas-topo">
            <PistaDoMes ritmo={f.ritmo} />
            <RegistoRapido categorias={f.categorias} aoRegistar={f.registar} />
          </div>

          <p className="financas-resumo">
            <span className="total-nome">Entrou</span>
            <strong className="total-valor total-valor--cesto">{escreverEuros(f.entrou)}</strong>
            <span className="total-nome">Prometido</span>
            <strong className="total-valor total-valor--cesto">{escreverEuros(f.comprometido)}</strong>
            <button type="button" className="botao-texto" onClick={() => definirAImportar(v => !v)}>
              {aImportar ? 'fechar o extracto' : 'trazer um extracto'}
            </button>
          </p>

          {aImportar && (
            <Importar
              categorias={f.categorias}
              existentes={f.movimentos}
              aoFechar={() => definirAImportar(false)}
              aoImportar={async linhas => {
                for (const l of linhas) await f.registar(l)
              }}
            />
          )}

          <div className="financas-grelha">
            <Envelopes envelopes={f.envelopes} aoDefinirLimite={f.definirLimiteDoMes} />
            <Comprometido
              compromissos={f.compromissos}
              pagamentos={f.pagamentos}
              categorias={f.porCategoria}
              comprometido={f.comprometido}
              porPagar={f.porPagar}
              aoPagar={pagar}
            />
          </div>

          <Livro
            movimentos={f.movimentos}
            categorias={f.porCategoria}
            aoApagar={f.apagarMovimento}
            aoMudarMes={mudarMes}
          />
        </div>
      ) : null}
    </main>
  )
}
