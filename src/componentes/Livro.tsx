import { useMemo, useState, type CSSProperties } from 'react'
import { Escrita } from './Escrita'
import { useRascunho } from '../dominio/rascunho'
import { ILupa, IPontos, iconeDePrato } from './Icones'
import { Menu } from './Menu'
import { useLivro } from '../dominio/livro'
import { chaveDeNome } from '../dominio/adiar'
import type { Casa, Conjunto, ItemDeConjunto, Prato } from '../dominio/tipos'

/** As filas de dentro: o que um prato leva, o que um conjunto leva. */
function Dentro({ nomes, filas, rotuloNovo, aoGuardar, aoAlterarNome, aoAlterarQtd, aoApagar }: {
  nomes: { vazio: string; cheio: string }
  filas: { id: string; nome: string; quantidade: string | null }[]
  rotuloNovo: string
  aoGuardar: (nome: string, quantidade: string | null) => void
  aoAlterarNome: (id: string, nome: string) => void
  aoAlterarQtd: (id: string, quantidade: string) => void
  aoApagar: (id: string, nome: string) => void
}) {
  const [nome, definirNome] = useState('')
  const [qtd, definirQtd] = useState('')
  const guardar = () => {
    if (!nome.trim()) return
    aoGuardar(nome.trim(), qtd.trim() || null)
    definirNome(''); definirQtd('')
  }
  const { linha, aoPerderFoco } = useRascunho(guardar)

  return (
    <div className="dentro">
      <p className="ingredientes-titulo">{filas.length === 0 ? nomes.vazio : nomes.cheio}</p>
      {filas.map(i => (
        <div className="fila" key={i.id}>
          <span className="fila-corpo">
            <Escrita valor={i.nome} rotulo={rotuloNovo} aoMudar={n => aoAlterarNome(i.id, n)} />
          </span>
          <input
            className="escrita escrita--num"
            value={i.quantidade ?? ''}
            placeholder="qt."
            maxLength={24}
            aria-label={`Quantidade de ${i.nome}`}
            onChange={e => aoAlterarQtd(i.id, e.target.value)}
          />
          <button type="button" className="botao-gelo" onClick={() => aoApagar(i.id, i.nome)}>
            <span className="sr-only">Tirar {i.nome}</span>
            <IPontos />
          </button>
        </div>
      ))}
      <div className="fila fila--branca" ref={linha} onBlur={aoPerderFoco}>
        <span className="fila-corpo">
          <Escrita valor={nome} rotulo={rotuloNovo} aoMudar={definirNome} aoConfirmar={guardar} />
        </span>
        <input
          className="escrita escrita--num"
          value={qtd}
          placeholder="qt."
          maxLength={24}
          aria-label="Quantidade"
          onChange={e => definirQtd(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); guardar() } }}
        />
      </div>
    </div>
  )
}

export interface AccoesDoLivro {
  pratos: Prato[]
  conjuntos: Conjunto[]
  criarConjunto: (nome: string) => Promise<Conjunto | null>
  renomearConjunto: (id: string, nome: string) => void
  apagarConjunto: (id: string) => void
  acrescentarItem: (conjuntoId: string, nome: string, quantidade: string | null) => void
  alterarItem: (id: string, mudanca: Partial<ItemDeConjunto>) => void
  apagarItem: (id: string) => void
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
  const [abertoConjunto, definirAbertoConjunto] = useState<string | null>(null)
  const [conjuntoAConfirmar, definirConjuntoAConfirmar] = useState<string | null>(null)
  const [novoConjunto, definirNovoConjunto] = useState('')
  const [aEscreverConjunto, definirAEscreverConjunto] = useState(false)

  const { linha: linhaPrato, aoPerderFoco: aoPerderFocoPrato } = useRascunho(() => { void escreverPrato() })

  const escreverConjunto = async () => {
    if (!novoConjunto.trim() || aEscreverConjunto) return
    definirAEscreverConjunto(true)
    const c = await l.criarConjunto(novoConjunto)
    definirAEscreverConjunto(false)
    if (c) { definirNovoConjunto(''); definirAbertoConjunto(c.id) }
  }

  const { linha: linhaConjunto, aoPerderFoco: aoPerderFocoConjunto } = useRascunho(() => { void escreverConjunto() })

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
    <main className="pagina">
      <header className="pagina-cabeca">
        <div>
          <h2 className="pagina-titulo">O livro da casa</h2>
          <p className="pagina-sub">Os pratos que se repetem, com o que cada um leva.</p>
        </div>
      </header>

      {l.estado === 'sem-migracao' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem tabelas</span>
          <span>Falta correr <code>supabase/migrations/20260824130000_ementa.sql</code>.</span>
        </p>
      )}
      {l.estado === 'sem-rede' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem ligação</span>
          <span>Não foi possível ler o livro. Verifique a rede.</span>
        </p>
      )}
      {l.recado && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Atenção</span>
          <span>{l.recado}</span>
          <button type="button" className="botao-texto" onClick={l.limparRecado}>Fechar</button>
        </p>
      )}

      <div className="livro-grelha">
        <section className="modulo com-cor" style={{ '--cor': 'var(--c-livro)' } as CSSProperties} aria-labelledby="livro-titulo">
          <header className="dia-cabeca">
            <h3 id="livro-titulo" className="dia-nome">Os pratos</h3>
            <span className="dia-data modulo-numero">
              {l.pratos.length === 0 ? 'ainda em branco'
                : l.pratos.length === 1 ? '1 prato'
                : `${l.pratos.length} pratos`}
            </span>
          </header>

          {l.pratos.length > 6 && (
            <label className="campo procura livro-procura">
              <span className="sr-only">Procurar um prato</span>
              <span className="procura-icone"><ILupa lado={18} /></span>
              <input
                className="campo-escrita"
                value={procura}
                onChange={e => definirProcura(e.target.value)}
                placeholder="procurar um prato…"
              />
            </label>
          )}

          {l.estado === 'pronto' && l.pratos.length === 0 && (
            <p className="vazio">
              O livro é o que esta casa cozinha. Escreva os pratos que fazem várias
              vezes, com o que cada um leva — depois é só marcá-los num dia e a
              lista de compras faz-se sozinha.
            </p>
          )}

          {encontrados.map(p => {
            const IconeP = iconeDePrato(p.nome)
            return (
              <div key={p.id} className="fila-grupo">
                <div className="fila">
                  <span className="tile" aria-hidden="true"><IconeP /></span>
                  <span className="fila-corpo">
                    <Escrita valor={p.nome} rotulo="Nome do prato" aoMudar={nome => l.renomearPrato(p.id, nome)} />
                  </span>
                  <button
                    type="button"
                    className="botao-texto modulo-numero"
                    aria-expanded={aberto === p.id}
                    onClick={() => definirAberto(aberto === p.id ? null : p.id)}
                  >
                    {p.ingredientes.length === 0 ? 'sem nada'
                      : p.ingredientes.length === 1 ? '1 coisa'
                      : `${p.ingredientes.length} coisas`}
                  </button>
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
                        tinta: 'var(--perigo)',
                        aoEscolher: () => definirAConfirmar(p.id),
                      },
                    ]}
                    gatilho={({ abrir, refs, controla, aberto: menuAberto }) => (
                      <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                        aria-expanded={menuAberto} aria-controls={controla} className="botao-gelo">
                        <span className="sr-only">O que fazer a {p.nome}</span>
                        <IPontos />
                      </button>
                    )}
                  />
                </div>

                {aConfirmar === p.id && (
                  <p className="confirmar" role="alert">
                    <span>
                      Tirar <strong>{p.nome}</strong> do livro? Os jantares já marcados
                      ficam escritos como estão — só o prato sai.
                    </span>
                    <button type="button" className="botao-texto botao-texto--perigo"
                      onClick={() => { l.apagarPrato(p.id); definirAConfirmar(null) }}>
                      Tirar do livro
                    </button>
                    <button type="button" className="botao-texto"
                      onClick={() => definirAConfirmar(null)}>
                      Deixar ficar
                    </button>
                  </p>
                )}

                {aberto === p.id && (
                  <Dentro
                    nomes={{
                      vazio: 'Sem ingredientes — assim, marcar este prato não põe nada na lista.',
                      cheio: 'O que este prato leva',
                    }}
                    filas={p.ingredientes}
                    rotuloNovo={`Ingrediente de ${p.nome}`}
                    aoGuardar={(nome, qtd) => l.acrescentarIngrediente(p.id, nome, qtd)}
                    aoAlterarNome={(id, nome) => l.alterarIngrediente(id, { nome })}
                    aoAlterarQtd={(id, quantidade) => l.alterarIngrediente(id, { quantidade })}
                    aoApagar={id => l.apagarIngrediente(id)}
                  />
                )}
              </div>
            )
          })}

          {procura && encontrados.length === 0 && (
            <p className="vazio">Nenhum prato com esse nome.</p>
          )}

          <div className="fila fila--branca" ref={linhaPrato} onBlur={aoPerderFocoPrato}>
            <span className="fila-corpo">
              <Escrita
                valor={novo}
                rotulo="Escrever um prato novo no livro"
                aoMudar={definirNovo}
                aoConfirmar={escreverPrato}
              />
            </span>
          </div>
        </section>

        <section className="modulo com-cor" style={{ '--cor': 'var(--c-lista)' } as CSSProperties} aria-labelledby="conjuntos-titulo">
          <header className="dia-cabeca">
            <h3 id="conjuntos-titulo" className="dia-nome">Os conjuntos</h3>
            <span className="dia-data modulo-numero">
              {l.conjuntos.length === 0 ? 'ainda nenhum'
                : l.conjuntos.length === 1 ? '1 conjunto' : `${l.conjuntos.length} conjuntos`}
            </span>
          </header>

          {l.estado === 'pronto' && l.conjuntos.length === 0 && (
            <p className="vazio">
              Coisas que se compram sempre juntas — “Pequeno-almoço”, “Limpeza”. Depois
              entram na lista de uma vez, sem se escrever item a item.
            </p>
          )}

          {l.conjuntos.map(c => (
            <div key={c.id} className="fila-grupo">
              <div className="fila">
                <span className="fila-corpo">
                  <Escrita valor={c.nome} rotulo="Nome do conjunto"
                    aoMudar={nome => l.renomearConjunto(c.id, nome)} />
                </span>
                <button type="button" className="botao-texto modulo-numero"
                  aria-expanded={abertoConjunto === c.id}
                  onClick={() => definirAbertoConjunto(abertoConjunto === c.id ? null : c.id)}>
                  {c.itens.length === 0 ? 'sem nada' : c.itens.length === 1 ? '1 coisa' : `${c.itens.length} coisas`}
                </button>
                <Menu
                  titulo={c.nome}
                  alinhar="direita"
                  opcoes={[
                    { id: 'ver', rotulo: abertoConjunto === c.id ? 'Fechar' : 'Ver o que leva',
                      aoEscolher: () => definirAbertoConjunto(abertoConjunto === c.id ? null : c.id) },
                    { id: 'apagar', rotulo: 'Apagar o conjunto', tinta: 'var(--perigo)',
                      aoEscolher: () => definirConjuntoAConfirmar(c.id) },
                  ]}
                  gatilho={({ abrir, refs, controla, aberto: m }) => (
                    <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                      aria-expanded={m} aria-controls={controla} className="botao-gelo">
                      <span className="sr-only">O que fazer a {c.nome}</span>
                      <IPontos />
                    </button>
                  )}
                />
              </div>

              {conjuntoAConfirmar === c.id && (
                <p className="confirmar" role="alert">
                  <span>Apagar <strong>{c.nome}</strong>? O que já está na lista fica.</span>
                  <button type="button" className="botao-texto botao-texto--perigo"
                    onClick={() => { l.apagarConjunto(c.id); definirConjuntoAConfirmar(null) }}>
                    Apagar
                  </button>
                  <button type="button" className="botao-texto"
                    onClick={() => definirConjuntoAConfirmar(null)}>Deixar ficar</button>
                </p>
              )}

              {abertoConjunto === c.id && (
                <Dentro
                  nomes={{
                    vazio: 'Sem nada — assim, este conjunto não põe nada na lista.',
                    cheio: 'O que este conjunto leva',
                  }}
                  filas={c.itens}
                  rotuloNovo={`Coisa de ${c.nome}`}
                  aoGuardar={(nome, qtd) => l.acrescentarItem(c.id, nome, qtd)}
                  aoAlterarNome={(id, nome) => l.alterarItem(id, { nome })}
                  aoAlterarQtd={(id, quantidade) => l.alterarItem(id, { quantidade })}
                  aoApagar={id => l.apagarItem(id)}
                />
              )}
            </div>
          ))}

          <div className="fila fila--branca" ref={linhaConjunto} onBlur={aoPerderFocoConjunto}>
            <span className="fila-corpo">
              <Escrita valor={novoConjunto} rotulo="Escrever um conjunto novo"
                aoMudar={definirNovoConjunto} aoConfirmar={escreverConjunto} />
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}

/** O contentor: liga a página ao livro que está no servidor. */
export function Livro({ casa }: { casa: Casa }) {
  const l = useLivro(casa.id)
  return <PaginaDoLivro l={l} />
}
