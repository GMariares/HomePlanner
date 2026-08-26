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

/**
 * O que ficou por alocar.
 *
 * Cada linha arruma-se aqui: escolhe-se a categoria e, se a chave ficar
 * marcada, a casa aprende — este fornecedor passa a arrumar-se sozinho,
 * neste extracto e nos próximos. Arrumar uma linha arruma logo as irmãs:
 * as três compras do Lidl saem juntas da lista.
 */
export function PorAlocar({ movimentos, categorias, aoAlocar }: {
  movimentos: Movimento[]
  categorias: Categoria[]
  aoAlocar: (opcao: {
    movimento: Movimento
    categoriaId: string
    chave: string | null
    irmas: Movimento[]
  }) => void
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

  const arrumar = (m: Movimento) => {
    const categoriaId = escolhas[m.id]
    if (!categoriaId) return
    const chave = lembrarDe(m) && chaveDe(m).length >= 2 ? chaveDe(m) : null
    const irmas = chave
      ? soltos.filter(s => s.id !== m.id && regraPara(s.descricao, [{ id: '', chave, nome: '', categoria_id: categoriaId }]))
      : []
    const guardar = () => aoAlocar({ movimento: m, categoriaId, chave, irmas })
    if (reduzido) { guardar(); return }
    definirASair(a => ({ ...a, [m.id]: true, ...Object.fromEntries(irmas.map(i => [i.id, true])) }))
    setTimeout(guardar, 260)
  }

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
            <button
              type="button"
              className="pilula alocar-arrumar"
              disabled={!escolhas[m.id]}
              onClick={() => arrumar(m)}
            >
              Arrumar
            </button>
          </div>
        </div>
      ))}
      {soltos.length > 30 && (
        <p className="vazio">e mais {soltos.length - 30} — aparecem à medida que estes se arrumam.</p>
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
