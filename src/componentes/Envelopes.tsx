import { useState, type CSSProperties } from 'react'
import type { Categoria, Compromisso, Envelope, Movimento } from '../dominio/financas'
import { escreverEuros, lerCents } from '../dominio/dinheiro'
import { Visto } from './Marcar'
import { IPontos, IMais, ISetaDir } from './Icones'
import { Menu } from './Menu'
import { Escrita } from './Escrita'
import { Dobra } from './Dobra'
import { useContagem, useMudanca } from '../dominio/animar'
import { useAdiar } from '../dominio/adiar'
import { useRascunho } from '../dominio/rascunho'
import { iconeDeCategoria } from './IconesFinancas'

/**
 * O tecto, editável no sítio onde se lê.
 *
 * Numa despesa é um tecto: o que falta até lá, ou o que já passou. Numa
 * entrada é uma previsão: o que falta receber, ou o que veio a mais. O
 * mesmo controlo, duas leituras — passar do previsto é boa notícia de um
 * lado e má do outro, e a palavra tem de o dizer.
 *
 * Quando o tecto vem somado das partes não se edita aqui: edita-se nas
 * partes. Dois números a dizerem coisas diferentes sobre o mesmo envelope
 * é como uma folha de cálculo começa a mentir.
 */
function Tecto({ id, nome, gasto, limite, entrada, somado = false, classe = 'envelope-tecto', aoDefinirLimite }: {
  id: string
  nome: string
  gasto: number
  limite: number | null
  entrada: boolean
  somado?: boolean
  classe?: string
  aoDefinirLimite: (id: string, cents: number | null) => void
}) {
  const [aEditar, definirAEditar] = useState(false)
  const [texto, definirTexto] = useState(limite != null ? String(limite / 100).replace('.', ',') : '')

  const guardar = () => {
    definirAEditar(false)
    aoDefinirLimite(id, lerCents(texto))
  }

  const estado = estadoDe(gasto, limite, entrada)
  const palavras =
    limite == null ? (entrada ? 'pôr uma previsão' : 'pôr um tecto')
      : gasto > limite ? (entrada ? `${escreverEuros(gasto - limite)} acima` : `passou ${escreverEuros(gasto - limite)}`)
      : gasto === limite ? (entrada ? 'certo no previsto' : 'certo no tecto')
      : `faltam ${escreverEuros(limite - gasto)}`

  if (somado) {
    return (
      <span className={classe} data-estado={estado} title={`Somado das partes de ${nome}`}>{palavras}</span>
    )
  }

  if (aEditar) {
    return (
      <input
        className="campo-escrita envelope-limite"
        value={texto}
        autoFocus
        onChange={ev => definirTexto(ev.target.value)}
        onBlur={guardar}
        onKeyDown={ev => { if (ev.key === 'Enter') guardar(); if (ev.key === 'Escape') definirAEditar(false) }}
        inputMode="decimal"
        aria-label={entrada ? `Previsão de ${nome}` : `Tecto de ${nome}`}
        placeholder={entrada ? 'sem previsão' : 'sem tecto'}
      />
    )
  }
  return (
    <button type="button" className={`botao-texto ${classe}`} data-estado={estado}
      onClick={ev => { ev.stopPropagation(); definirAEditar(true) }}>
      {palavras}
    </button>
  )
}

/**
 * Passar do tecto é notícia dos dois lados, mas só de um é problema: um
 * envelope rebenta, uma entrada acima do previsto é boa notícia. E o
 * estado é de quem o tem — sem isto, uma mãe rebentada pintava de vermelho
 * partes que estão em dia.
 */
const estadoDe = (gasto: number, limite: number | null, entrada: boolean) =>
  limite == null ? undefined
    : entrada ? (gasto >= limite ? 'atingido' : undefined)
    : (gasto > limite ? 'passou' : undefined)

/**
 * A barra de um envelope ou de uma parte.
 *
 * Decoração de uma verdade escrita — e, no instante em que um gasto entra,
 * a única coisa no ecrã que diz o TAMANHO do que entrou: o pedaço entre
 * onde a barra estava e onde ficou acende-se e assenta. É o golpe à vista.
 */
function Barra({ gasto, limite, entrada, fina = false }: {
  gasto: number; limite: number | null; entrada: boolean; fina?: boolean
}) {
  const { anterior, aMudar } = useMudanca(gasto)
  const pct = (v: number) => (limite && limite > 0 ? Math.min(100, Math.max(0, (v / limite) * 100)) : 0)
  const cheio = pct(gasto)
  const antes = pct(anterior)
  const golpe = aMudar && Math.abs(cheio - antes) > 0.4
  return (
    <span className={fina ? 'envelope-barra envelope-barra--fina' : 'envelope-barra'} aria-hidden="true">
      <span className="envelope-cheio" data-estado={estadoDe(gasto, limite, entrada)} style={{ width: `${cheio}%` }} />
      {golpe && (
        <span
          className="envelope-golpe"
          style={{
            insetInlineStart: `${Math.min(antes, cheio)}%`,
            width: `${Math.abs(cheio - antes)}%`,
          }}
        />
      )}
    </span>
  )
}

const contar = (n: number) => (n === 0 ? 'sem movimentos' : n === 1 ? '1 movimento' : `${n} movimentos`)

/**
 * Um envelope. Fechado é uma linha: nome, gasto, barra, tecto. Aberto é a
 * categoria por dentro — as partes de que se faz, com o tecto de cada uma,
 * os movimentos do mês, o nome editável. Um gesto abre; tudo o resto vive
 * lá dentro.
 */
function Fila({ e, aberto, aoAbrir, movimentosDaArvore, aoRenomear, aoCriarFilha, aoApagarMovimento, aoDefinirLimite }: {
  e: Envelope
  aberto: boolean
  aoAbrir: () => void
  movimentosDaArvore: Movimento[]
  aoRenomear: (id: string, nome: string) => void
  aoCriarFilha: (mae: Categoria, nome: string) => void
  aoApagarMovimento: (id: string) => void
  aoDefinirLimite: (id: string, cents: number | null) => void
}) {
  const [novaFilha, definirNovaFilha] = useState('')
  const guardarFilha = () => {
    if (!novaFilha.trim()) return
    aoCriarFilha(e.categoria, novaFilha.trim())
    definirNovaFilha('')
  }
  const { linha, aoPerderFoco } = useRascunho(guardarFilha)
  const adiar = useAdiar<{ nome: string }>((id, junto) => aoRenomear(id, junto.nome))

  const Icone = iconeDeCategoria(e.categoria.icone)
  const entrada = e.categoria.natureza === 'entrada'
  /* O envelope acusa a recepção: o azulejo carrega a cor por um instante
     e o total anda até ao número novo. Só quando muda com alguém a ver. */
  const { aMudar: recebeu } = useMudanca(e.gasto)
  const total = useContagem(e.gasto)
  const porCategoria = new Map<string, string>()
  for (const f of e.filhos) porCategoria.set(f.categoria.id, f.categoria.nome)

  return (
    <div
      className="envelope com-cor"
      style={{ '--cor': e.categoria.cor } as CSSProperties}
      data-aberto={aberto || undefined}
      data-recebeu={recebeu || undefined}
    >
      {/* O tecto é um botão e vive FORA do botão que abre: um botão dentro
          de outro não é HTML válido e o de dentro deixa de se alcançar pelo
          teclado. Abre-se pela linha de cima; o tecto edita-se no pé. */}
      <button
        type="button"
        className="envelope-topo"
        aria-expanded={aberto}
        onClick={aoAbrir}
      >
        <span className="tile envelope-tile" aria-hidden="true"><Icone /></span>
        <span className="envelope-corpo">
          <span className="envelope-cabeca">
            <span className="envelope-titulo">
              <span className="envelope-abrir" aria-hidden="true"><ISetaDir lado={12} /></span>
              <span className="envelope-nome">{e.categoria.nome}</span>
            </span>
            <span className="envelope-valor">{escreverEuros(total)}</span>
          </span>
          <Barra gasto={e.gasto} limite={e.limite} entrada={entrada} />
        </span>
      </button>

      <div className="envelope-pe">
        <Tecto
          id={e.categoria.id}
          nome={e.categoria.nome}
          /* O mesmo número contado que está no cabeçalho. Com o valor real
             aqui, o pé dizia "faltam 115,70 €" enquanto o topo ainda ia em
             267,81 — dois números a discordarem à vista um do outro. */
          gasto={total}
          limite={e.limite}
          entrada={entrada}
          somado={e.limiteSomado}
          aoDefinirLimite={aoDefinirLimite}
        />
        <span className="envelope-conta">{contar(e.quantos)}</span>
      </div>

      {aberto && (
        <div className="envelope-dentro">
          <label className="campo envelope-renome">
            <span className="campo-nome">Nome</span>
            <Escrita
              valor={e.categoria.nome}
              rotulo={`Nome da categoria ${e.categoria.nome}`}
              aoMudar={nome => adiar(e.categoria.id, { nome })}
            />
          </label>

          <p className="campo-nome">As partes de {e.categoria.nome}</p>
          {e.limiteSomado ? (
            <p className="vazio envelope-somado">
              {entrada ? 'A previsão' : 'O tecto'} de {e.categoria.nome} é a soma das
              partes: <strong>{escreverEuros(e.limite ?? 0)}</strong>. Mude uma parte e o
              total acompanha.
            </p>
          ) : e.filhos.length > 0 && (
            <p className="vazio envelope-somado">
              {entrada ? 'Ponha uma previsão' : 'Ponha um tecto'} numa parte e o
              total de {e.categoria.nome} passa a ser a soma das partes.
            </p>
          )}
          {e.filhos.map(f => (
            <div className="fila envelope-filha" key={f.categoria.id}>
              <span className="fila-corpo">
                <span className="fila-nome">{f.categoria.nome}</span>
                <span className="fila-meta">
                  <Tecto
                    id={f.categoria.id}
                    nome={f.categoria.nome}
                    gasto={f.gasto}
                    limite={f.limite}
                    entrada={entrada}
                    classe="envelope-tecto envelope-tecto--parte"
                    aoDefinirLimite={aoDefinirLimite}
                  />
                  <span>{contar(f.quantos)}</span>
                </span>
                {f.limite != null && <Barra gasto={f.gasto} limite={f.limite} entrada={entrada} fina />}
              </span>
              <span className="fila-numero">{escreverEuros(f.gasto)}</span>
            </div>
          ))}
          <div className="fila fila--branca envelope-filha" ref={linha} onBlur={aoPerderFoco}>
            <span className="fila-mais" aria-hidden="true"><IMais lado={14} /></span>
            <span className="fila-corpo">
              <input
                className="escrita"
                value={novaFilha}
                onChange={ev => definirNovaFilha(ev.target.value)}
                onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); guardarFilha() } }}
                placeholder="acrescentar uma parte…"
                aria-label={`Acrescentar uma subcategoria a ${e.categoria.nome}`}
                maxLength={40}
              />
            </span>
          </div>

          {movimentosDaArvore.length > 0 && (
            <>
              <p className="campo-nome envelope-mov-titulo">Este mês</p>
              {movimentosDaArvore.map(m => (
                <div className="fila envelope-filha" key={m.id}>
                  <span className="fila-corpo">
                    <span className="fila-nome">{m.descricao || 'sem descrição'}</span>
                    <span className="fila-meta">
                      <span>{m.data.slice(8, 10)}/{m.data.slice(5, 7)}</span>
                      {m.categoria_id && porCategoria.get(m.categoria_id) && (
                        <span className="movimento-cat">{porCategoria.get(m.categoria_id)}</span>
                      )}
                    </span>
                  </span>
                  <span className="fila-numero" data-entrada={m.valor_cents > 0 || undefined}>
                    {m.valor_cents > 0 ? '+' : ''}{escreverEuros(m.valor_cents)}
                  </span>
                  <button type="button" className="botao-gelo" onClick={() => aoApagarMovimento(m.id)}>
                    <span className="sr-only">Apagar {m.descricao}</span>
                    <IPontos />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Os envelopes de uma natureza.
 *
 * A despesa e a entrada usam o mesmo desenho de propósito: quem já sabe
 * abrir "Casa" e pôr um tecto na Renda sabe abrir "Ordenado" e prever o
 * subsídio. Só as palavras mudam, porque só as palavras é que mudam de
 * sentido.
 */
export function Envelopes({ envelopes, movimentos, raizDe, natureza = 'despesa', aoDefinirLimite, aoRenomear, aoCriarFilha, aoCriarRaiz, aoApagarMovimento }: {
  envelopes: Envelope[]
  movimentos: Movimento[]
  raizDe: Map<string, string>
  natureza?: 'despesa' | 'entrada'
  aoDefinirLimite: (id: string, cents: number | null) => void
  aoRenomear: (id: string, nome: string) => void
  aoCriarFilha: (mae: Categoria, nome: string) => void
  aoCriarRaiz: (nome: string) => void
  aoApagarMovimento: (id: string) => void
}) {
  const [aberto, definirAberto] = useState<string | null>(null)
  const [novo, definirNovo] = useState('')
  const entrada = natureza === 'entrada'
  const guardarNovo = () => {
    if (novo.trim().length < 2) return
    aoCriarRaiz(novo.trim())
    definirNovo('')
  }
  if (envelopes.length === 0) return null

  const titulo = entrada ? 'As entradas' : 'Os envelopes'
  const id = entrada ? 'entradas' : 'envelopes'

  return (
    <section className="modulo caixa-envelopes" aria-labelledby={`${id}-titulo`}>
      <header className="dia-cabeca dia-cabeca--lista">
        <h3 id={`${id}-titulo`} className="dia-nome">{titulo}</h3>
        <span className="dia-data">{entrada ? 'o que se espera receber' : 'o que é variável'}</span>
      </header>
      <div className="envelopes" data-um-aberto={aberto !== null || undefined}>
        {envelopes.map(e => (
          <Fila
            key={e.categoria.id}
            e={e}
            aberto={aberto === e.categoria.id}
            aoAbrir={() => definirAberto(a => (a === e.categoria.id ? null : e.categoria.id))}
            movimentosDaArvore={movimentos
              .filter(m => m.categoria_id != null && raizDe.get(m.categoria_id) === e.categoria.id && !m.compromisso_id)
              .sort((a, b) => b.data.localeCompare(a.data))}
            aoRenomear={aoRenomear}
            aoCriarFilha={aoCriarFilha}
            aoApagarMovimento={aoApagarMovimento}
            aoDefinirLimite={aoDefinirLimite}
          />
        ))}
        <div className="fila fila--branca envelope-novo">
          <span className="fila-mais" aria-hidden="true"><IMais lado={16} /></span>
          <span className="fila-corpo">
            <input
              className="escrita"
              value={novo}
              onChange={ev => definirNovo(ev.target.value)}
              onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); guardarNovo() } }}
              onBlur={guardarNovo}
              placeholder={entrada ? 'acrescentar uma entrada…' : 'acrescentar um envelope…'}
              aria-label={entrada ? 'Acrescentar uma entrada nova' : 'Acrescentar uma categoria nova'}
              maxLength={40}
            />
          </span>
        </div>
      </div>
    </section>
  )
}

/**
 * O comprometido — fora dos envelopes de propósito.
 *
 * A renda não compete com o mercado, e o ritmo do mês só faz sentido sobre
 * o que ainda se pode decidir. Aqui só se vê o que já está prometido e o
 * que falta pagar.
 */
export function Comprometido({ compromissos, pagamentos, categorias, comprometido, porPagar, aoPagar }: {
  compromissos: Compromisso[]
  pagamentos: Map<string, Movimento>
  categorias: Map<string, Categoria>
  comprometido: number
  porPagar: number
  aoPagar: (c: Compromisso, pago: boolean) => void
}) {
  if (compromissos.length === 0) return null
  const hoje = new Date().getDate()

  return (
    <section className="modulo" aria-labelledby="comprometido-titulo">
      <header className="dia-cabeca">
        <h3 id="comprometido-titulo" className="dia-nome">Já prometido</h3>
        <span className="dia-data modulo-numero">
          {porPagar === 0 ? 'está tudo pago' : `${escreverEuros(porPagar)} por pagar`}
        </span>
      </header>

      {compromissos
        .slice()
        .sort((a, b) => a.dia_do_mes - b.dia_do_mes)
        .map(c => {
          const pago = pagamentos.get(c.id)
          const atrasado = !pago && c.dia_do_mes < hoje
          const cor = c.categoria_id ? categorias.get(c.categoria_id)?.cor : undefined
          return (
            <div className="fila com-cor" key={c.id} style={{ '--cor': cor ?? 'var(--c-financas)' } as CSSProperties}
              data-feita={pago ? true : undefined}>
              <Visto
                feita={Boolean(pago)}
                aoAlternar={() => aoPagar(c, !pago)}
                rotulo={`Marcar ${c.nome} como pago`}
              />
              <span className="fila-corpo">
                <span className="fila-nome">{c.nome}</span>
                <span className="fila-meta">
                  <span>dia {c.dia_do_mes}</span>
                  {c.fornecedor && <span>{c.fornecedor}</span>}
                  {atrasado && <span className="compromisso-atraso">em atraso</span>}
                </span>
              </span>
              <span className="fila-numero">{escreverEuros(c.valor_cents)}</span>
            </div>
          )
        })}

      <p className="total-fila">
        <span className="total-nome">Todos os meses</span>
        <strong className="total-valor">{escreverEuros(comprometido)}</strong>
        <span className="total-nota">fora dos envelopes: não entra no passo do mês</span>
      </p>
    </section>
  )
}

/**
 * As últimas linhas do mês, com o que se pode corrigir à mão.
 *
 * Fechado por omissão: é o arquivo do mês, não a sua pergunta. Quem o
 * quer, abre-o; quem não o quer, não o tem a empurrar o resto para baixo.
 */
export function Livro({ movimentos, categorias, aoApagar, aoMudarMes }: {
  movimentos: Movimento[]
  categorias: Map<string, Categoria>
  aoApagar: (id: string) => void
  aoMudarMes: (m: Movimento) => void
}) {
  return (
    <Dobra
      id="livro"
      titulo="O que passou"
      conta={movimentos.length === 0 ? 'nada ainda' : contar(movimentos.length)}
    >
      {movimentos.length === 0 && (
        <p className="vazio">Registe um gasto na linha de cima, ou traga um extracto do banco.</p>
      )}

      {movimentos
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .map(m => {
          const cat = m.categoria_id ? categorias.get(m.categoria_id) : null
          const entrada = m.valor_cents > 0
          const noutroMes = Boolean(m.mes_conta_manual)
          const naoConta = cat?.natureza === 'transferencia'
          return (
            <div className="fila com-cor" key={m.id}
              style={{ '--cor': cat?.cor ?? 'var(--c-financas)' } as CSSProperties}>
              <span className="fila-corpo">
                <span className="fila-nome">{m.descricao || 'sem descrição'}</span>
                <span className="fila-meta">
                  <span>{m.data.slice(8, 10)}/{m.data.slice(5, 7)}</span>
                  {cat && <span className="movimento-cat">{cat.nome}</span>}
                  {m.fornecedor && <span>{m.fornecedor}</span>}
                  {naoConta && <span className="movimento-neutro">não conta</span>}
                  {noutroMes && <span className="movimento-mes">contado neste mês</span>}
                </span>
              </span>
              <span className="fila-numero" data-entrada={entrada || undefined} data-neutro={naoConta || undefined}>
                {entrada ? '+' : ''}{escreverEuros(m.valor_cents)}
              </span>
              <Menu
                titulo={m.descricao || 'este movimento'}
                alinhar="direita"
                opcoes={[
                  {
                    id: 'mes',
                    rotulo: noutroMes ? 'Contar no mês da data' : 'Contar noutro mês',
                    aoEscolher: () => aoMudarMes(m),
                  },
                  { id: 'apagar', rotulo: 'Apagar', tinta: 'var(--perigo)', aoEscolher: () => aoApagar(m.id) },
                ]}
                gatilho={({ abrir, refs, controla, aberto }) => (
                  <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                    aria-expanded={aberto} aria-controls={controla} className="botao-gelo">
                    <span className="sr-only">O que fazer a {m.descricao || 'este movimento'}</span>
                    <IPontos />
                  </button>
                )}
              />
            </div>
          )
        })}
    </Dobra>
  )
}
