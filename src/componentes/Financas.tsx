import { useState } from 'react'
import type { Casa } from '../dominio/tipos'
import { chaveDoMes, mesDeChave, nomeDoMes, useAno, useFinancas, type Movimento } from '../dominio/financas'
import { PistaDoMes } from './PistaDoMes'
import { Balanco } from './Resumo'
import { Comprometido, Envelopes, Livro } from './Envelopes'
import { RegistoRapido } from './RegistoRapido'
import { Importar } from './Importar'
import { TabelaDoAno } from './TabelaDoAno'
import { Fornecedores, PorAlocar } from './Alocar'
import { ISetaEsq, ISetaDir } from './Icones'

/* Um envelope novo nasce com uma cor do mundo; muda-se depois se se quiser. */
const CORES_NOVAS = ['#4a7fa8', '#a0682c', '#7a5bb5', '#3e8560', '#a65a86', '#7d7a4a', '#c0566e']
const CORES_ENTRADA = ['#2f7e78', '#467a52', '#3e8560', '#4a7fa8']

/** O mês seguinte ou o anterior, sem tropeçar em Janeiro. */
const mover = (m: string, n: number) => {
  const d = mesDeChave(m)
  return chaveDoMes(new Date(d.getFullYear(), d.getMonth() + n, 1))
}

export function Financas({ casa }: { casa: Casa }) {
  const [mes, definirMes] = useState(() => chaveDoMes(new Date()))
  const [aImportar, definirAImportar] = useState(false)
  /* Mês para viver, ano para perceber: a mesma página, dois passos atrás. */
  const [vista, definirVista] = useState<'mes' | 'ano'>('mes')
  const [ano, definirAno] = useState(() => new Date().getFullYear())
  const f = useFinancas(casa.id, mes)
  const dadosDoAno = useAno(vista === 'ano' ? casa.id : null, ano, f.categorias)
  /* Sem categoria nenhuma não há mês nem ano para ver: a navegação só
     apareceria para levar a duas páginas vazias. */
  const primeiraVez = f.estado === 'pronto' && f.categorias.length === 0
  const esteMes = mes === chaveDoMes(new Date())
  const esteAno = ano === new Date().getFullYear()

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
          <p className="pagina-sub pagina-sub--mes">
            {vista === 'mes' ? nomeDoMes(mesDeChave(mes)) : `o ano de ${ano}`}
          </p>
        </div>
        {!primeiraVez && <div className="financas-navegacao">
          <nav className="semana-nav" aria-label="Mês ou ano">
            <button type="button" className="semana-nav-botao" aria-pressed={vista === 'mes'}
              data-activa={vista === 'mes' || undefined} onClick={() => definirVista('mes')}>
              Mês
            </button>
            <button type="button" className="semana-nav-botao" aria-pressed={vista === 'ano'}
              data-activa={vista === 'ano' || undefined} onClick={() => definirVista('ano')}>
              Ano
            </button>
          </nav>
          {vista === 'mes' ? (
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
          ) : (
            <nav className="semana-nav" aria-label="Anos">
              <button type="button" className="semana-nav-botao" onClick={() => definirAno(a => a - 1)}>
                <ISetaEsq lado={16} />
                <span className="sr-only">Ano anterior</span>
              </button>
              <button type="button" className="semana-nav-botao" onClick={() => definirAno(new Date().getFullYear())} disabled={esteAno}>
                Este ano
              </button>
              <button type="button" className="semana-nav-botao" onClick={() => definirAno(a => a + 1)}>
                <ISetaDir lado={16} />
                <span className="sr-only">Ano seguinte</span>
              </button>
            </nav>
          )}
        </div>}
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

      {vista === 'ano' ? (
        <TabelaDoAno ano={ano} dados={dadosDoAno} />
      ) : f.estado === 'pronto' && f.categorias.length === 0 ? (
        <section className="modulo financas-primeiro">
          <h3 className="portada-titulo">Ainda não há contas nesta casa</h3>
          <p className="portada-texto">
            Começa-se com quinze: mercado, casa, contas, transportes e o resto
            da despesa, o ordenado do lado das entradas, e uma para as
            transferências entre contas suas. Muda-se, apaga-se e acrescenta-se
            a qualquer altura.
          </p>
          <button type="button" className="pilula" onClick={() => f.semear()}>
            Começar com as categorias propostas
          </button>
        </section>
      ) : f.estado === 'pronto' || f.movimentos.length > 0 ? (
        <div className="financas">
          <Balanco
            r={f.resumo}
            accao={
              <button type="button" className="botao-texto" onClick={() => definirAImportar(v => !v)}>
                {aImportar ? 'fechar o extracto' : 'trazer um extracto'}
              </button>
            }
          />

          {aImportar && (
            <Importar
              categorias={f.categorias}
              fornecedores={f.fornecedores}
              existentes={f.movimentos}
              aoFechar={() => definirAImportar(false)}
              aoImportar={async linhas => {
                for (const l of linhas) await f.registar(l)
              }}
            />
          )}

          {/* Uma grelha só, de duas colunas que correm cada uma à sua
              altura. Em duas grelhas separadas, a pista e o registo
              partilhavam linha: o registo com quinze categorias ficava
              duas cabeças mais alto e debaixo da pista abria-se um buraco
              de porcelana até aos envelopes. */}
          <div className="financas-grelha">
            <div className="financas-coluna financas-coluna--larga">
              <PistaDoMes ritmo={f.ritmo} />
              <Envelopes
                envelopes={f.envelopes}
                movimentos={f.movimentos}
                raizDe={f.raizDe}
                aoDefinirLimite={f.definirLimiteDoMes}
                aoRenomear={(id, nome) => f.guardarCategoria({ id, nome })}
                aoCriarFilha={(mae, nome) => f.guardarCategoria({
                  nome, natureza: mae.natureza, cor: mae.cor, icone: mae.icone,
                  mae_id: mae.id, ordem: mae.ordem,
                })}
                aoCriarRaiz={nome => f.guardarCategoria({
                  nome, natureza: 'despesa',
                  cor: CORES_NOVAS[f.categorias.length % CORES_NOVAS.length],
                  icone: 'saco',
                  ordem: 150 + f.categorias.length,
                })}
                aoApagarMovimento={f.apagarMovimento}
              />
            </div>
            <div className="financas-coluna">
              <RegistoRapido
                categorias={f.categorias}
                fornecedores={f.fornecedores}
                aoRegistar={f.registar}
                aoGuardarFornecedor={f.semFornecedores ? undefined : f.guardarFornecedor}
              />
              <Envelopes
                envelopes={f.entradas}
                movimentos={f.movimentos}
                raizDe={f.raizDe}
                natureza="entrada"
                aoDefinirLimite={f.definirLimiteDoMes}
                aoRenomear={(id, nome) => f.guardarCategoria({ id, nome })}
                aoCriarFilha={(mae, nome) => f.guardarCategoria({
                  nome, natureza: mae.natureza, cor: mae.cor, icone: mae.icone,
                  mae_id: mae.id, ordem: mae.ordem,
                })}
                aoCriarRaiz={nome => f.guardarCategoria({
                  nome, natureza: 'entrada',
                  cor: CORES_ENTRADA[f.categorias.length % CORES_ENTRADA.length],
                  icone: 'moeda',
                  ordem: 250 + f.categorias.length,
                })}
                aoApagarMovimento={f.apagarMovimento}
              />
              <Comprometido
                compromissos={f.compromissos}
                pagamentos={f.pagamentos}
                categorias={f.porCategoria}
                comprometido={f.comprometido}
                porPagar={f.porPagar}
                aoPagar={pagar}
              />
            </div>
          </div>

          {!f.semFornecedores && (
            <PorAlocar
              movimentos={f.movimentos}
              categorias={f.categorias}
              aoAlocar={lote => {
                /* Um lote de setenta linhas é uma chamada por categoria e
                   uma para as regras, não cento e quarenta idas ao
                   servidor. As irmãs vão no mesmo saco da sua linha. */
                const porCategoria = new Map<string, string[]>()
                for (const { movimento, categoriaId, irmas } of lote) {
                  const ids = porCategoria.get(categoriaId) ?? []
                  ids.push(movimento.id, ...irmas.map(i => i.id))
                  porCategoria.set(categoriaId, ids)
                }
                f.alocarMovimentos([...porCategoria].map(([categoria_id, ids]) => ({ ids, categoria_id })))
                const regras = lote
                  .filter(a => a.chave)
                  .map(a => ({
                    chave: a.chave!,
                    nome: a.movimento.descricao.trim().slice(0, 40),
                    categoria_id: a.categoriaId,
                  }))
                if (regras.length > 0 && !f.semFornecedores) f.guardarFornecedores(regras)
              }}
            />
          )}

          <Livro
            movimentos={f.movimentos}
            categorias={f.porCategoria}
            aoApagar={f.apagarMovimento}
            aoApagarVarios={f.apagarMovimentos}
            aoMudarMes={mudarMes}
          />

          {!f.semFornecedores && (
            <Fornecedores
              fornecedores={f.fornecedores}
              categorias={f.categorias}
              aoGuardar={f.guardarFornecedor}
              aoApagar={f.apagarFornecedor}
            />
          )}
          {f.semFornecedores && (
            <p className="faixa" role="status">
              <span className="faixa-marca">Falta a nona migração</span>
              <span>
                Os fornecedores precisam de
                <code> supabase/migrations/20260829120000_fornecedores.sql </code>
                no SQL Editor. Até lá, o resto funciona.
              </span>
            </p>
          )}
        </div>
      ) : null}
    </main>
  )
}
