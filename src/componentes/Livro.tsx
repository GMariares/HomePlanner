import { useMemo, useState } from 'react'
import { Cabecalho } from './Cabecalho'
import { Escrita } from './Escrita'
import { Reticencias } from './Icones'
import { Menu } from './Menu'
import { useLivro } from '../dominio/livro'
import { chaveDeNome } from '../dominio/adiar'
import { inicioDaSemana } from '../dominio/semana'
import type { Casa, Prato } from '../dominio/tipos'

function Ingredientes({ prato, aoAcrescentar, aoAlterar, aoApagar }: {
  prato: Prato
  aoAcrescentar: (pratoId: string, nome: string, quantidade: string | null) => void
  aoAlterar: (id: string, mudanca: { nome?: string; quantidade?: string | null }) => void
  aoApagar: (id: string) => void
}) {
  const [nome, definirNome] = useState('')
  const [qtd, definirQtd] = useState('')
  const guardar = () => {
    if (!nome.trim()) return
    aoAcrescentar(prato.id, nome.trim(), qtd.trim() || null)
    definirNome(''); definirQtd('')
  }

  return (
    <>
      <div className="linha linha--legenda">
        <span className="linha-goteira" />
        <span className="linha-corpo impresso">
          {prato.ingredientes.length === 0
            ? 'Sem ingredientes — assim, marcar este prato não põe nada na lista.'
            : 'O que este prato leva'}
        </span>
        <span className="linha-hora" />
        <span className="linha-accoes" />
      </div>
      {prato.ingredientes.map(i => (
          <div className="linha linha--ingrediente linha--dentro" key={i.id}>
            <span className="linha-goteira" />
            <span className="linha-corpo">
              <Escrita
                valor={i.nome}
                rotulo={`Ingrediente de ${prato.nome}`}
                aoMudar={n => aoAlterar(i.id, { nome: n })}
              />
            </span>
            <span className="linha-hora">
              <input
                className="escrita escrita--hora"
                value={i.quantidade ?? ''}
                placeholder="qt."
                maxLength={24}
                aria-label={`Quantidade de ${i.nome}`}
                onChange={e => aoAlterar(i.id, { quantidade: e.target.value })}
              />
            </span>
            <span className="linha-accoes">
              <button type="button" className="botao-nu" onClick={() => aoApagar(i.id)}>
                <span className="sr-only">Apagar {i.nome} de {prato.nome}</span>
                <Reticencias />
              </button>
            </span>
          </div>
        ))}

      <div className="linha linha--ingrediente linha--dentro linha--branco">
          <span className="linha-goteira" />
          <span className="linha-corpo">
            <Escrita
              valor={nome}
              rotulo={`Escrever um ingrediente de ${prato.nome}`}
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
              maxLength={24}
              aria-label="Quantidade do ingrediente novo"
              onChange={e => definirQtd(e.target.value)}
              onBlur={guardar}
            />
          </span>
          <span className="linha-accoes" />
      </div>
    </>
  )
}

export interface AccoesDoLivro {
  pratos: Prato[]
  estado: 'a-carregar' | 'pronto' | 'sem-rede' | 'sem-migracao'
  recado: string | null
  limparRecado: () => void
  criarPrato: (nome: string) => Promise<Prato | null>
  renomearPrato: (id: string, nome: string) => void
  apagarPrato: (id: string) => void
  acrescentarIngrediente: (pratoId: string, nome: string, quantidade: string | null) => void
  alterarIngrediente: (id: string, mudanca: { nome?: string; quantidade?: string | null }) => void
  apagarIngrediente: (id: string) => void
}

/** A página em si, sem servidor: é isto que se vê e é isto que se ensaia. */
export function PaginaDoLivro({ l }: { l: AccoesDoLivro }) {
  const [procura, definirProcura] = useState('')
  const [aberto, definirAberto] = useState<string | null>(null)
  const [aConfirmar, definirAConfirmar] = useState<string | null>(null)
  const [novo, definirNovo] = useState('')
  const [aEscrever, definirAEscrever] = useState(false)

  const encontrados = useMemo(() => {
    const chave = chaveDeNome(procura)
    return chave ? l.pratos.filter(p => chaveDeNome(p.nome).includes(chave)) : l.pratos
  }, [l.pratos, procura])

  const escreverPrato = async () => {
    if (!novo.trim() || aEscrever) return
    definirAEscrever(true)
    const p = await l.criarPrato(novo)
    definirAEscrever(false)
    if (p) { definirNovo(''); definirAberto(p.id) }
  }

  return (
    <>
      {l.estado === 'sem-migracao' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem tabelas</span>
          <span>Falta correr <code>supabase/migrations/20260824130000_ementa.sql</code>.</span>
        </p>
      )}
      {l.estado === 'sem-rede' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem ligação</span>
          <span>Não foi possível ler o livro. Verifique a rede.</span>
        </p>
      )}
      {l.recado && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Atenção</span>
          <span>{l.recado}</span>
          <button type="button" className="aviso-repor impresso" onClick={l.limparRecado}>Fechar</button>
        </p>
      )}

      <main className="abertura-envelope">
        <div className="abertura abertura--ementa">
          <div className="pagina">
            <section aria-labelledby="livro-titulo">
              <header className="dia-cabecalho">
                <h2 id="livro-titulo" className="dia-nome">O livro</h2>
                <span className="dia-data impresso">
                  {l.pratos.length === 0 ? 'ainda em branco'
                    : l.pratos.length === 1 ? '1 prato'
                    : `${l.pratos.length} pratos`}
                </span>
              </header>

              {l.pratos.length > 6 && (
                <label className="campo campo--procura">
                  <span className="impresso">Procurar</span>
                  <input
                    className="campo-escrita"
                    value={procura}
                    onChange={e => definirProcura(e.target.value)}
                    placeholder="o nome do prato"
                  />
                </label>
              )}

              {l.estado === 'pronto' && l.pratos.length === 0 && (
                <p className="livro-vazio">
                  O livro é o que esta casa cozinha. Escreva aqui os pratos que fazem
                  várias vezes, com o que cada um leva — depois é só marcá-los num dia e
                  a lista de compras faz-se sozinha.
                </p>
              )}

              <div className="dia-corpo pauta margem" data-vazio={l.pratos.length === 0 || undefined}>
                {encontrados.map(p => (
                  <div key={p.id}>
                    <div className="linha linha--prato" data-aberto={aberto === p.id || undefined}>
                      <span className="linha-goteira" />
                      <span className="linha-corpo">
                        <Escrita
                          valor={p.nome}
                          rotulo="Nome do prato"
                          aoMudar={nome => l.renomearPrato(p.id, nome)}
                        />
                      </span>
                      <span className="linha-hora">
                        <button
                          type="button"
                          className="prato-conta impresso"
                          aria-expanded={aberto === p.id}
                          onClick={() => definirAberto(aberto === p.id ? null : p.id)}
                        >
                          {p.ingredientes.length === 0 ? 'sem nada'
                            : p.ingredientes.length === 1 ? '1 coisa'
                            : `${p.ingredientes.length} coisas`}
                        </button>
                      </span>
                      <span className="linha-accoes">
                        <Menu
                          titulo={p.nome}
                          alinhar="direita"
                          opcoes={[
                            {
                              id: 'ver',
                              rotulo: aberto === p.id ? 'Fechar os ingredientes' : 'Ver os ingredientes',
                              aoEscolher: () => definirAberto(aberto === p.id ? null : p.id),
                            },
                            {
                              id: 'apagar',
                              rotulo: 'Tirar do livro',
                              tinta: 'var(--margem)',
                              aoEscolher: () => definirAConfirmar(p.id),
                            },
                          ]}
                          gatilho={({ abrir, refs, controla, aberto: menuAberto }) => (
                            <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                              aria-expanded={menuAberto} aria-controls={controla} className="botao-nu">
                              <span className="sr-only">O que fazer a {p.nome}</span>
                              <Reticencias />
                            </button>
                          )}
                        />
                      </span>
                    </div>

                    {aConfirmar === p.id && (
                      <p className="confirmar" role="alert">
                        <span>
                          Tirar <strong>{p.nome}</strong> do livro? Os jantares já marcados
                          ficam escritos como estão — só o prato sai.
                        </span>
                        <button type="button" className="confirmar-sim impresso"
                          onClick={() => { l.apagarPrato(p.id); definirAConfirmar(null) }}>
                          Tirar do livro
                        </button>
                        <button type="button" className="botao-linha impresso"
                          onClick={() => definirAConfirmar(null)}>
                          Deixar ficar
                        </button>
                      </p>
                    )}

                    {aberto === p.id && (
                      <Ingredientes
                        prato={p}
                        aoAcrescentar={l.acrescentarIngrediente}
                        aoAlterar={l.alterarIngrediente}
                        aoApagar={l.apagarIngrediente}
                      />
                    )}
                  </div>
                ))}

                {procura && encontrados.length === 0 && (
                  <div className="linha linha--prato">
                    <span className="linha-goteira" />
                    <span className="linha-corpo impresso">Nenhum prato com esse nome.</span>
                    <span className="linha-hora" />
                    <span className="linha-accoes" />
                  </div>
                )}

                <div className="linha linha--prato linha--branco">
                  <span className="linha-goteira" />
                  <span className="linha-corpo">
                    <Escrita
                      valor={novo}
                      rotulo="Escrever um prato novo no livro"
                      aoMudar={definirNovo}
                      aoTerminar={escreverPrato}
                      aoConfirmar={escreverPrato}
                    />
                  </span>
                  <span className="linha-hora" />
                  <span className="linha-accoes" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}

/** O contentor: liga a página ao livro que está no servidor. */
export function Livro({ casa, email, aoSair, aoTrocarDeVista }: {
  casa: Casa
  email: string
  aoSair: () => void
  aoTrocarDeVista: (v: 'semana' | 'ementa' | 'livro') => void
}) {
  const l = useLivro(casa.id)
  return (
    <div className="caderneta">
      <Cabecalho
        casa={casa}
        email={email}
        inicio={inicioDaSemana()}
        aoRecuar={() => {}}
        aoAvancar={() => {}}
        aoHoje={() => {}}
        naSemanaCorrente
        aoSair={aoSair}
        vista="livro"
        aoTrocarDeVista={aoTrocarDeVista}
        semSemana
      />
      <PaginaDoLivro l={l} />
    </div>
  )
}
