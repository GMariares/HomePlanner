import { useMemo, useState, type CSSProperties } from 'react'
import type { Categoria, Movimento } from '../dominio/financas'
import { proporChave, regraPara, type Fornecedor } from '../dominio/fornecedores'
import { escreverEuros } from '../dominio/dinheiro'
import { IPontos } from './Icones'
import { useMovimentoReduzido } from '../dominio/animar'
import { Dobra } from './Dobra'

/** As categorias num selector, com as partes debaixo das suas mães. */
export function EscolhaDeCategoria({ categorias, valor, aoEscolher, rotulo, vazio = 'por alocar' }: {
  categorias: Categoria[]
  valor: string
  aoEscolher: (id: string) => void
  rotulo: string
  vazio?: string
}) {
  const vivas = categorias.filter(c => !c.arquivada)
  const raizes = vivas.filter(c => !c.mae_id)
  return (
    <select
      className="campo-escrita periodo-dia alocar-escolha"
      value={valor}
      onChange={e => aoEscolher(e.target.value)}
      aria-label={rotulo}
    >
      <option value="">{vazio}</option>
      {raizes.map(r => {
        const filhas = vivas.filter(c => c.mae_id === r.id)
        return filhas.length === 0 ? (
          <option key={r.id} value={r.id}>{r.nome}</option>
        ) : (
          <optgroup key={r.id} label={r.nome}>
            <option value={r.id}>{r.nome} — em geral</option>
            {filhas.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </optgroup>
        )
      })}
    </select>
  )
}

/** Uma linha arrumada, com as irmãs que vão com ela. */
export interface Arrumacao {
  movimento: Movimento
  categoriaId: string
  chave: string | null
  irmas: Movimento[]
}

/**
 * O que ficou por alocar.
 *
 * Escolhe-se a categoria de cada linha e arruma-se o lote de uma vez. Com
 * a chave marcada a casa aprende: o fornecedor passa a arrumar-se sozinho
 * nos próximos extractos, e as irmãs desta saem já com ela — as três
 * compras do Lidl vão juntas sem se lhes tocar.
 */
export function PorAlocar({ movimentos, categorias, aoAlocar }: {
  movimentos: Movimento[]
  categorias: Categoria[]
  /** Vai sempre um lote, mesmo quando é de um só: arrumar é um gesto. */
  aoAlocar: (lote: Arrumacao[]) => void
}) {
  const soltos = useMemo(
    () => movimentos.filter(m => !m.categoria_id).sort((a, b) => b.data.localeCompare(a.data)),
    [movimentos],
  )
  const [escolhas, definirEscolhas] = useState<Record<string, string>>({})
  const [chaves, definirChaves] = useState<Record<string, string>>({})
  const [lembrar, definirLembrar] = useState<Record<string, boolean>>({})
  /* Arrumada, a linha sai por onde entrou em vez de desaparecer: sem isso,
     arrumar três irmãs de uma vez lê-se como se a lista tivesse partido. */
  const [aSair, definirASair] = useState<Record<string, boolean>>({})
  const reduzido = useMovimentoReduzido()

  if (soltos.length === 0) return null

  const temTransferencias = categorias.some(c => c.natureza === 'transferencia')
  const chaveDe = (m: Movimento) => chaves[m.id] ?? proporChave(m.descricao)
  const lembrarDe = (m: Movimento) => lembrar[m.id] ?? true

  const prontos = soltos.filter(m => escolhas[m.id])

  /**
   * O lote do que já tem categoria escolhida.
   *
   * Uma linha que arruma as suas irmãs tira-as da conta das seguintes: sem
   * isto, escolher categoria em duas compras do mesmo Lidl mandava a
   * mesma linha duas vezes, e a segunda ia para a categoria errada.
   */
  const fazerLote = (): Arrumacao[] => {
    const feitos = new Set<string>()
    const lote: Arrumacao[] = []
    for (const m of prontos) {
      if (feitos.has(m.id)) continue
      const categoriaId = escolhas[m.id]
      const chave = lembrarDe(m) && chaveDe(m).length >= 2 ? chaveDe(m) : null
      const irmas = chave
        ? soltos.filter(s => s.id !== m.id && !feitos.has(s.id)
            && regraPara(s.descricao, [{ id: '', chave, nome: '', categoria_id: categoriaId }]))
        : []
      feitos.add(m.id)
      for (const i of irmas) feitos.add(i.id)
      lote.push({ movimento: m, categoriaId, chave, irmas })
    }
    return lote
  }

  const arrumarTudo = () => {
    const lote = fazerLote()
    if (lote.length === 0) return
    const guardar = () => { aoAlocar(lote); definirEscolhas({}) }
    if (reduzido) { guardar(); return }
    const saem: Record<string, boolean> = {}
    for (const a of lote) { saem[a.movimento.id] = true; for (const i of a.irmas) saem[i.id] = true }
    definirASair(x => ({ ...x, ...saem }))
    setTimeout(guardar, 260)
  }

  /** Quantas linhas saem da lista, contando as irmãs que vão à boleia. */
  const quantasSaem = fazerLote().reduce((n, a) => n + 1 + a.irmas.length, 0)

  return (
    <section className="modulo alocar com-cor" style={{ '--cor': 'var(--c-lista)' } as CSSProperties} aria-labelledby="alocar-titulo">
      <header className="dia-cabeca">
        <h3 id="alocar-titulo" className="dia-nome">Por alocar</h3>
        <span className="dia-data modulo-numero">
          {soltos.length === 1 ? '1 movimento sem categoria' : `${soltos.length} movimentos sem categoria`}
        </span>
      </header>
      <p className="vazio alocar-explica">
        Diga de que categoria é cada um. Com a chave marcada, a casa aprende:
        este fornecedor passa a arrumar-se sozinho nos próximos extractos.
        {temTransferencias && ' Uma passagem entre contas suas vai para Transferências: fica no livro e não conta para nada.'}
      </p>

      {soltos.slice(0, 30).map(m => (
        <div className="alocar-linha" key={m.id} data-a-sair={aSair[m.id] || undefined}>
          <div className="fila">
            <span className="fila-corpo">
              <span className="fila-nome">{m.descricao || 'sem descrição'}</span>
              <span className="fila-meta"><span>{m.data.slice(8, 10)}/{m.data.slice(5, 7)}</span></span>
            </span>
            <span className="fila-numero" data-entrada={m.valor_cents > 0 || undefined}>
              {m.valor_cents > 0 ? '+' : ''}{escreverEuros(m.valor_cents)}
            </span>
          </div>
          <div className="alocar-accoes">
            <EscolhaDeCategoria
              categorias={categorias}
              valor={escolhas[m.id] ?? ''}
              aoEscolher={id => definirEscolhas(e => ({ ...e, [m.id]: id }))}
              rotulo={`Categoria de ${m.descricao}`}
              vazio="que categoria…"
            />
            <label className="alocar-lembrar">
              <input
                type="checkbox"
                checked={lembrarDe(m)}
                onChange={e => definirLembrar(l => ({ ...l, [m.id]: e.target.checked }))}
              />
              <span>lembrar</span>
            </label>
            <input
              className="campo-escrita alocar-chave"
              value={chaveDe(m)}
              onChange={e => definirChaves(c => ({ ...c, [m.id]: e.target.value }))}
              aria-label={`A chave que identifica ${m.descricao}`}
              disabled={!lembrarDe(m)}
              maxLength={40}
            />
          </div>
        </div>
      ))}
      {soltos.length > 30 && (
        <p className="vazio">e mais {soltos.length - 30} — aparecem à medida que estes se arrumam.</p>
      )}

      {/* Um gesto para o lote inteiro, a flutuar sobre a lista enquanto ela
          lhe passa por baixo: escolhe-se de cima a baixo e arruma-se uma
          vez, em vez de carregar setenta e sete vezes no mesmo botão. Só
          existe quando há alguma coisa para arrumar — uma barra parada a
          meio de uma lista é uma divisória a fingir de acção. */}
      {prontos.length > 0 && (
        <div className="alocar-rodape">
          <span className="total-nome">
            {prontos.length === 1 ? '1 escolhida' : `${prontos.length} escolhidas`}
            {quantasSaem > prontos.length && ` · mais ${quantasSaem - prontos.length} ${quantasSaem - prontos.length === 1 ? 'irmã' : 'irmãs'}`}
          </span>
          <button type="button" className="pilula alocar-arrumar" onClick={arrumarTudo}>
            Arrumar {quantasSaem}
          </button>
        </div>
      )}
    </section>
  )
}

/**
 * Os fornecedores da casa — a secção configurável. Cada regra é uma linha:
 * a chave que casa com o extracto, o nome por que a casa lhe chama, e a
 * categoria (ou a parte) onde entra.
 */
export function Fornecedores({ fornecedores, categorias, aoGuardar, aoApagar }: {
  fornecedores: Fornecedor[]
  categorias: Categoria[]
  aoGuardar: (f: Partial<Fornecedor> & { id?: string }) => void
  aoApagar: (id: string) => void
}) {
  const [novaChave, definirNovaChave] = useState('')
  const [novoNome, definirNovoNome] = useState('')
  const [novaCategoria, definirNovaCategoria] = useState('')
  const porId = new Map(categorias.map(c => [c.id, c]))

  const acrescentar = () => {
    if (novaChave.trim().length < 2) return
    aoGuardar({
      chave: novaChave.trim().toLocaleLowerCase('pt'),
      nome: novoNome.trim() || novaChave.trim(),
      categoria_id: novaCategoria || null,
    })
    definirNovaChave(''); definirNovoNome(''); definirNovaCategoria('')
  }

  return (
    <Dobra
      id="fornecedores"
      titulo="Os fornecedores"
      conta={fornecedores.length === 0 ? 'ainda nenhum'
        : fornecedores.length === 1 ? '1 regra' : `${fornecedores.length} regras`}
    >
      <p className="vazio alocar-explica">
        “Auchan é Mercado” diz-se uma vez. A chave casa com qualquer descrição
        que a contenha — “auchan” apanha AUCHAN MATOSINHOS e AUCHAN GAIA.
      </p>

      {fornecedores.map(f => {
        const cat = f.categoria_id ? porId.get(f.categoria_id) : null
        const mae = cat?.mae_id ? porId.get(cat.mae_id) : null
        return (
          <div className="fila fornecedor-fila com-cor" key={f.id} style={{ '--cor': cat?.cor ?? 'var(--tinta)' } as CSSProperties}>
            <span className="fila-corpo">
              <span className="fila-nome">{f.nome || f.chave}</span>
              <span className="fila-meta">
                <span className="fornecedor-chave">«{f.chave}»</span>
                {mae && <span className="movimento-cat">{mae.nome}</span>}
              </span>
            </span>
            <EscolhaDeCategoria
              categorias={categorias}
              valor={f.categoria_id ?? ''}
              aoEscolher={id => aoGuardar({ id: f.id, categoria_id: id || null })}
              rotulo={`Categoria de ${f.nome || f.chave}`}
              vazio="sem categoria"
            />
            <button type="button" className="botao-gelo" onClick={() => aoApagar(f.id)}>
              <span className="sr-only">Apagar a regra {f.chave}</span>
              <IPontos />
            </button>
          </div>
        )
      })}

      <div className="alocar-accoes fornecedor-novo">
        <input className="campo-escrita alocar-chave" value={novaChave} placeholder="chave — ex.: auchan"
          onChange={e => definirNovaChave(e.target.value)} maxLength={40}
          aria-label="Chave da regra nova" />
        <input className="campo-escrita alocar-chave" value={novoNome} placeholder="nome — ex.: Auchan"
          onChange={e => definirNovoNome(e.target.value)} maxLength={40}
          aria-label="Nome do fornecedor novo" />
        <EscolhaDeCategoria categorias={categorias} valor={novaCategoria}
          aoEscolher={definirNovaCategoria} rotulo="Categoria da regra nova" vazio="que categoria…" />
        <button type="button" className="pilula alocar-arrumar" disabled={novaChave.trim().length < 2}
          onClick={acrescentar}>
          Guardar
        </button>
      </div>
    </Dobra>
  )
}
