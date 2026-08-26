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
import { EscolhaDeCategoria } from './Alocar'

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
                {/* O nome de uma parte edita-se onde se lê, como tudo o que
                    a família escreveu: só a mãe tinha campo de nome e as
                    partes ficavam presas ao nome com que nasceram. */}
                <Escrita
                  valor={f.categoria.nome}
                  rotulo={`Nome de ${f.categoria.nome}`}
                  aoMudar={nome => adiar(f.categoria.id, { nome })}
                />
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
 * O editor de um compromisso — o mesmo para o que nasce e para o que muda.
 *
 * Quatro coisas fazem um compromisso: o nome, quanto, em que dia do mês, e
 * de que categoria é. O fornecedor é opcional e vive no fim, onde as
 * coisas opcionais devem viver.
 */
function EditorDeCompromisso({ compromisso, categorias, dias, aoGuardar, aoFechar, aoRetirar }: {
  compromisso: Compromisso | null
  categorias: Categoria[]
  /** Quantos dias tem o mês que se está a ver, para o dia não mentir. */
  dias: number
  aoGuardar: (c: Partial<Compromisso> & { id?: string }) => void
  aoFechar: () => void
  aoRetirar?: (c: Compromisso) => void
}) {
  const [nome, definirNome] = useState(compromisso?.nome ?? '')
  const [valor, definirValor] = useState(
    compromisso ? String(compromisso.valor_cents / 100).replace('.', ',') : '')
  const [dia, definirDia] = useState(String(compromisso?.dia_do_mes ?? 1))
  const [categoria, definirCategoria] = useState(compromisso?.categoria_id ?? '')
  const [fornecedor, definirFornecedor] = useState(compromisso?.fornecedor ?? '')

  const cents = lerCents(valor)
  const numeroDoDia = Number(dia)
  const diaValido = Number.isInteger(numeroDoDia) && numeroDoDia >= 1 && numeroDoDia <= 31
  /* A renda "do dia 31" em Fevereiro não existe: diz-se o que acontece. */
  const diaTardio = diaValido && numeroDoDia > dias
  const nomeCurto = nome.trim().length < 2
  const podeGuardar = !nomeCurto && cents !== null && cents > 0 && diaValido

  const guardar = () => {
    if (!podeGuardar) return
    aoGuardar({
      ...(compromisso ? { id: compromisso.id } : {}),
      nome: nome.trim(),
      valor_cents: Math.abs(cents!),
      dia_do_mes: numeroDoDia,
      categoria_id: categoria || null,
      fornecedor: fornecedor.trim() || null,
      activo: true,
    })
    aoFechar()
  }

  return (
    <div className="compromisso-editor">
      <div className="compromisso-campos">
        <label className="campo compromisso-nome">
          <span className="campo-nome">O que é</span>
          <input className="campo-escrita" value={nome} autoFocus maxLength={60}
            onChange={e => definirNome(e.target.value)}
            placeholder="Renda, escola, seguro…" aria-label="O que é este compromisso" />
        </label>
        <label className="campo">
          <span className="campo-nome">Quanto</span>
          <input className="campo-escrita compromisso-valor" value={valor} inputMode="decimal" maxLength={12}
            onChange={e => definirValor(e.target.value)} placeholder="0,00" aria-label="Quanto é todos os meses" />
        </label>
        <label className="campo">
          <span className="campo-nome">Dia do mês</span>
          <input className="campo-escrita compromisso-dia" value={dia} inputMode="numeric" maxLength={2}
            onChange={e => definirDia(e.target.value.replace(/\D/g, ''))} aria-label="Em que dia do mês" />
        </label>
        <label className="campo compromisso-categoria">
          <span className="campo-nome">Categoria</span>
          <EscolhaDeCategoria categorias={categorias} valor={categoria}
            aoEscolher={definirCategoria} rotulo="Categoria do compromisso" vazio="sem categoria" />
        </label>
        <label className="campo compromisso-fornecedor">
          <span className="campo-nome">A quem se paga <span className="campo-opcional">se interessar</span></span>
          <input className="campo-escrita" value={fornecedor} maxLength={40}
            onChange={e => definirFornecedor(e.target.value)}
            placeholder="Senhorio, NOS, Colégio…" aria-label="A quem se paga" />
        </label>
      </div>

      {diaTardio && (
        <p className="compromisso-aviso" role="status">
          Este mês só tem {dias} dias: nos meses curtos conta-se no último.
        </p>
      )}

      <div className="compromisso-accoes">
        <button type="button" className="pilula" disabled={!podeGuardar} onClick={guardar}>
          {compromisso ? 'Guardar' : 'Acrescentar'}
        </button>
        <button type="button" className="botao-texto" onClick={aoFechar}>deixar estar</button>
        {compromisso && aoRetirar && (
          <button type="button" className="botao-texto botao-texto--perigo compromisso-retirar"
            onClick={() => { aoRetirar(compromisso); aoFechar() }}>
            Retirar
          </button>
        )}
        {!podeGuardar && (nome.trim() || valor) && (
          <span className="compromisso-falta">
            {nomeCurto ? 'falta o nome'
              : cents === null || cents === 0 ? 'falta quanto é'
              : !diaValido ? 'o dia é de 1 a 31'
              : ''}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * O comprometido — fora dos envelopes de propósito.
 *
 * A renda não compete com o mercado, e o ritmo do mês só faz sentido sobre
 * o que ainda se pode decidir. Aqui vê-se o que já está prometido, o que
 * falta pagar, e é aqui que se acrescenta, se muda e se retira — o bloco
 * alimenta o "previsto" da despesa, e um número que a casa não pode
 * escrever é um número que a julga sem lhe dar a palavra.
 */
export function Comprometido({ compromissos, retirados = [], pagamentos, categorias, categoriasVivas = [], mes, comprometido, porPagar, aoPagar, aoGuardar, aoRetirar }: {
  compromissos: Compromisso[]
  retirados?: Compromisso[]
  pagamentos: Map<string, Movimento>
  categorias: Map<string, Categoria>
  categoriasVivas?: Categoria[]
  /** O mês que se está a ver, para saber o que está mesmo em atraso. */
  mes?: string
  comprometido: number
  porPagar: number
  aoPagar: (c: Compromisso, pago: boolean) => void
  aoGuardar?: (c: Partial<Compromisso> & { id?: string }) => void
  aoRetirar?: (c: Compromisso) => void
}) {
  const [aEditar, definirAEditar] = useState<string | null>(null)
  const [aVerRetirados, definirAVerRetirados] = useState(false)
  const podeMexer = Boolean(aoGuardar)

  /* "Em atraso" só quer dizer alguma coisa no mês em que se está: a ver
     Setembro em Agosto, o dia 8 ainda não chegou; a ver Julho, já passou
     tudo. Com a data de hoje sozinha, um mês futuro abria em atraso. */
  const agora = new Date()
  const oMes = mes ? new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)) - 1, 1) : agora
  const dias = new Date(oMes.getFullYear(), oMes.getMonth() + 1, 0).getDate()
  const mesmoMes = oMes.getFullYear() === agora.getFullYear() && oMes.getMonth() === agora.getMonth()
  const jaPassou = oMes < new Date(agora.getFullYear(), agora.getMonth(), 1)
  const diaDeHoje = mesmoMes ? agora.getDate() : jaPassou ? 32 : 0

  if (compromissos.length === 0 && !podeMexer) return null

  return (
    <section className="modulo" aria-labelledby="comprometido-titulo">
      <header className="dia-cabeca">
        <h3 id="comprometido-titulo" className="dia-nome">Já prometido</h3>
        <span className="dia-data modulo-numero">
          {compromissos.length === 0 ? 'ainda nada'
            : porPagar === 0 ? 'está tudo pago' : `${escreverEuros(porPagar)} por pagar`}
        </span>
      </header>

      {compromissos.length === 0 && (
        <p className="vazio">
          A renda, a escola, os seguros — o que chega todos os meses na mesma data.
          Fica fora dos envelopes de propósito, e é o que o previsto da despesa
          soma aos tectos.
        </p>
      )}

      {compromissos.map(c => {
        const pago = pagamentos.get(c.id)
        const atrasado = !pago && Math.min(c.dia_do_mes, dias) < diaDeHoje
        const cor = c.categoria_id ? categorias.get(c.categoria_id)?.cor : undefined
        const aberto = aEditar === c.id
        return (
          <div key={c.id}>
            <div className="fila com-cor" style={{ '--cor': cor ?? 'var(--c-financas)' } as CSSProperties}
              data-feita={pago ? true : undefined}>
              <Visto
                feita={Boolean(pago)}
                aoAlternar={() => aoPagar(c, !pago)}
                rotulo={`Marcar ${c.nome} como pago`}
              />
              {podeMexer ? (
                <button type="button" className="compromisso-abrir" aria-expanded={aberto}
                  onClick={() => definirAEditar(a => (a === c.id ? null : c.id))}>
                  <span className="fila-nome">{c.nome}</span>
                  <span className="fila-meta">
                    <span>dia {c.dia_do_mes > dias ? `${c.dia_do_mes} — este mês, dia ${dias}` : c.dia_do_mes}</span>
                    {c.fornecedor && <span>{c.fornecedor}</span>}
                    {atrasado && <span className="compromisso-atraso">em atraso</span>}
                  </span>
                </button>
              ) : (
                <span className="fila-corpo">
                  <span className="fila-nome">{c.nome}</span>
                  <span className="fila-meta">
                    <span>dia {c.dia_do_mes}</span>
                    {c.fornecedor && <span>{c.fornecedor}</span>}
                    {atrasado && <span className="compromisso-atraso">em atraso</span>}
                  </span>
                </span>
              )}
              <span className="fila-numero">{escreverEuros(c.valor_cents)}</span>
            </div>
            {aberto && aoGuardar && (
              <EditorDeCompromisso
                compromisso={c}
                categorias={categoriasVivas}
                dias={dias}
                aoGuardar={aoGuardar}
                aoFechar={() => definirAEditar(null)}
                aoRetirar={aoRetirar}
              />
            )}
          </div>
        )
      })}

      {podeMexer && (aEditar === 'novo' ? (
        <EditorDeCompromisso
          compromisso={null}
          categorias={categoriasVivas}
          dias={dias}
          aoGuardar={aoGuardar!}
          aoFechar={() => definirAEditar(null)}
        />
      ) : (
        <button type="button" className="fila fila--branca compromisso-novo"
          onClick={() => definirAEditar('novo')}>
          <span className="fila-mais" aria-hidden="true"><IMais lado={16} /></span>
          <span className="fila-corpo"><span className="fila-nome">acrescentar um compromisso…</span></span>
        </button>
      ))}

      {compromissos.length > 0 && (
        <p className="total-fila">
          <span className="total-nome">Todos os meses</span>
          <strong className="total-valor">{escreverEuros(comprometido)}</strong>
          <span className="total-nota">fora dos envelopes: não entra no passo do mês</span>
        </p>
      )}

      {/* Retirar tem de ter volta: um seguro que se cancelou e afinal ficou,
          ou um dedo enganado, não podem custar reescrever a linha. */}
      {podeMexer && retirados.length > 0 && (
        <p className="compromisso-retirados">
          <button type="button" className="botao-texto" onClick={() => definirAVerRetirados(v => !v)}>
            {aVerRetirados ? 'esconder os retirados'
              : retirados.length === 1 ? 'ver 1 retirado' : `ver ${retirados.length} retirados`}
          </button>
          {aVerRetirados && retirados.map(c => (
            <span className="compromisso-retirado" key={c.id}>
              <span className="fila-nome">{c.nome}</span>
              <span className="fila-numero">{escreverEuros(c.valor_cents)}</span>
              <button type="button" className="botao-texto"
                onClick={() => aoGuardar!({ id: c.id, activo: true })}>
                repor
              </button>
            </span>
          ))}
        </p>
      )}
    </section>
  )
}

/**
 * As últimas linhas do mês, com o que se pode corrigir à mão.
 *
 * Fechado por omissão: é o arquivo do mês, não a sua pergunta. Quem o
 * quer, abre-o; quem não o quer, não o tem a empurrar o resto para baixo.
 */
export function Livro({ movimentos, categorias, aoApagar, aoApagarVarios, aoMudarMes }: {
  movimentos: Movimento[]
  categorias: Map<string, Categoria>
  aoApagar: (id: string) => void
  aoApagarVarios?: (ids: string[]) => void
  aoMudarMes: (m: Movimento) => void
}) {
  /* Escolher e apagar em bloco: depois de um extracto trazer noventa
     linhas, apagar uma a uma pelo menu de cada uma não é trabalho que se
     peça a ninguém. */
  const [aEscolher, definirAEscolher] = useState(false)
  const [escolhidos, definirEscolhidos] = useState<Set<string>>(new Set())
  const [aConfirmar, definirAConfirmar] = useState(false)

  const sair = () => { definirAEscolher(false); definirEscolhidos(new Set()); definirAConfirmar(false) }
  const alternar = (id: string) => {
    definirAConfirmar(false)
    definirEscolhidos(e => {
      const n = new Set(e)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }
  const apagarEscolhidos = () => {
    const ids = [...escolhidos]
    if (aoApagarVarios) aoApagarVarios(ids)
    else ids.forEach(aoApagar)
    sair()
  }

  return (
    <Dobra
      id="livro"
      titulo="O que passou"
      conta={movimentos.length === 0 ? 'nada ainda' : contar(movimentos.length)}
    >
      {movimentos.length === 0 && (
        <p className="vazio">Registe um gasto na linha de cima, ou traga um extracto do banco.</p>
      )}

      {movimentos.length > 0 && (
        <p className="livro-barra">
          <button type="button" className="botao-texto" onClick={() => (aEscolher ? sair() : definirAEscolher(true))}>
            {aEscolher ? 'terminar' : 'escolher para apagar'}
          </button>
          {aEscolher && (
            <button
              type="button"
              className="botao-texto"
              onClick={() => definirEscolhidos(e =>
                e.size === movimentos.length ? new Set() : new Set(movimentos.map(m => m.id)))}
            >
              {escolhidos.size === movimentos.length ? 'nenhum' : 'todos'}
            </button>
          )}
        </p>
      )}

      {movimentos
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .map(m => {
          const cat = m.categoria_id ? categorias.get(m.categoria_id) : null
          const entrada = m.valor_cents > 0
          const noutroMes = Boolean(m.mes_conta_manual)
          const naoConta = cat?.natureza === 'transferencia'
          const escolhido = escolhidos.has(m.id)
          return (
            <div className={aEscolher ? 'fila com-cor fila--escolha' : 'fila com-cor'} key={m.id}
              style={{ '--cor': cat?.cor ?? 'var(--c-financas)' } as CSSProperties}
              data-escolhido={escolhido || undefined}>
              {aEscolher && (
                <Visto
                  feita={escolhido}
                  aoAlternar={() => alternar(m.id)}
                  rotulo={`Escolher ${m.descricao || 'este movimento'} para apagar`}
                />
              )}
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
              {!aEscolher && <Menu
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
              />}
            </div>
          )
        })}

      {aEscolher && (
        <p className="total-fila livro-apagar">
          <span className="total-nome">
            {escolhidos.size === 0 ? 'nenhum escolhido'
              : escolhidos.size === 1 ? '1 escolhido' : `${escolhidos.size} escolhidos`}
          </span>
          {/* Apagar não tem volta nesta casa: pergunta-se uma vez, na linha,
              sem tirar o ecrã a ninguém. */}
          {aConfirmar ? (
            <>
              <button type="button" className="pilula livro-confirmar" onClick={apagarEscolhidos}>
                Apagar {escolhidos.size}
              </button>
              <button type="button" className="botao-texto" onClick={() => definirAConfirmar(false)}>
                deixar estar
              </button>
              <span className="total-nota">não há volta a dar depois de apagar</span>
            </>
          ) : (
            <button
              type="button"
              className="botao-texto botao-texto--perigo"
              disabled={escolhidos.size === 0}
              onClick={() => definirAConfirmar(true)}
            >
              Apagar escolhidos
            </button>
          )}
        </p>
      )}
    </Dobra>
  )
}
