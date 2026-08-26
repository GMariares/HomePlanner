import { useMemo, useState } from 'react'
import { adivinharMapa, lerData, lerFicheiro, type Grelha, type Mapa } from '../dominio/extracto'
import { escreverEuros, lerCents } from '../dominio/dinheiro'
import type { Categoria, Movimento } from '../dominio/financas'
import { regraPara, type Fornecedor } from '../dominio/fornecedores'
import { chaveDeNome } from '../dominio/adiar'
import { EscolhaDeCategoria } from './Alocar'

interface Candidata {
  data: string
  descricao: string
  valor_cents: number
  impressao: string
  jaExiste: boolean
  usar: boolean
  /** A regra que casou, se alguma casou. Sem regra, fica por alocar. */
  regra: Fornecedor | null
}

/** A mesma linha do mesmo extracto, vinda outra vez, é a mesma linha. */
const impressaoDe = (data: string, cents: number, descricao: string) =>
  `${data}|${cents}|${chaveDeNome(descricao).replace(/\s+/g, ' ').slice(0, 40)}`

const NOMES = ['data', 'descricao', 'valor'] as const

/**
 * Trazer um extracto do banco.
 *
 * Três passos e nada de magia: escolher o ficheiro, confirmar que colunas
 * são quais, e ver o que vai entrar antes de entrar. O que já cá está
 * aparece marcado e desligado — reimportar um período sobreposto é o
 * normal, não um erro do utilizador.
 */
export function Importar({ categorias, fornecedores = [], existentes, aoImportar, aoFechar }: {
  categorias: Categoria[]
  fornecedores?: Fornecedor[]
  existentes: Movimento[]
  aoImportar: (linhas: Partial<Movimento>[]) => Promise<void>
  aoFechar: () => void
}) {
  const [grelha, definirGrelha] = useState<Grelha | null>(null)
  const [mapa, definirMapa] = useState<Mapa | null>(null)
  const [erro, definirErro] = useState<string | null>(null)
  const [categoria, definirCategoria] = useState('')
  const [aGuardar, definirAGuardar] = useState(false)
  const [saltar, definirSaltar] = useState<Set<number>>(new Set())

  const jaCa = useMemo(() => {
    const s = new Set<string>()
    for (const m of existentes) {
      s.add(m.impressao ?? impressaoDe(m.data, m.valor_cents, m.descricao))
    }
    return s
  }, [existentes])

  const escolher = async (f: File | undefined) => {
    if (!f) return
    definirErro(null)
    try {
      const g = await lerFicheiro(f)
      if (g.length === 0) { definirErro('O ficheiro está vazio.'); return }
      definirGrelha(g)
      definirMapa(adivinharMapa(g))
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : 'Não foi possível ler o ficheiro.')
    }
  }

  const candidatas: Candidata[] = useMemo(() => {
    if (!grelha || !mapa || mapa.data < 0 || mapa.valor < 0) return []
    const linhas = mapa.cabecalho ? grelha.slice(1) : grelha
    const saida: Candidata[] = []
    for (const l of linhas) {
      const data = lerData(l[mapa.data] ?? '')
      let cents = lerCents(l[mapa.valor] ?? '')
      /* Alguns bancos põem o débito numa coluna e o crédito noutra: o que
         está no crédito entra positivo, o que está no débito sai. */
      if (mapa.credito != null && mapa.credito >= 0) {
        const cr = lerCents(l[mapa.credito] ?? '')
        if (cr) cents = Math.abs(cr)
        else if (cents) cents = -Math.abs(cents)
      }
      if (!data || cents === null || cents === 0) continue
      const descricao = (mapa.descricao >= 0 ? l[mapa.descricao] ?? '' : '').trim()
      const impressao = impressaoDe(data, cents, descricao)
      /* As regras da casa arrumam o que conhecem; o resto fica marcado. */
      const regra = regraPara(descricao, fornecedores)
      saida.push({ data, descricao, valor_cents: cents, impressao, jaExiste: jaCa.has(impressao), usar: true, regra })
    }
    return saida
  }, [grelha, mapa, jaCa, fornecedores])

  const novas = candidatas.filter((c, i) => !c.jaExiste && !saltar.has(i))
  const repetidas = candidatas.filter(c => c.jaExiste).length
  const arrumadas = novas.filter(c => c.regra?.categoria_id).length
  const porAlocar = novas.length - arrumadas
  const porId = new Map(categorias.map(c => [c.id, c]))

  const guardar = async () => {
    definirAGuardar(true)
    await aoImportar(novas.map(c => ({
      data: c.data,
      valor_cents: c.valor_cents,
      descricao: c.descricao,
      fornecedor: c.regra?.nome || null,
      /* A regra manda; sem regra vale o recurso escolhido; sem recurso,
         fica sem categoria — marcado por alocar, nunca calado na errada. */
      categoria_id: c.regra?.categoria_id ?? (categoria || null),
      impressao: c.impressao,
    })))
    definirAGuardar(false)
    aoFechar()
  }

  return (
    <section className="modulo importar" aria-labelledby="importar-titulo">
      <header className="dia-cabeca">
        <h3 id="importar-titulo" className="dia-nome">Trazer um extracto</h3>
        <button type="button" className="botao-texto" onClick={aoFechar}>fechar</button>
      </header>

      {!grelha ? (
        <>
          <p className="vazio">
            Exporte o extracto do site do banco em CSV ou XLSX e traga-o para aqui.
            Nada sai deste aparelho para lado nenhum sem passar por si: primeiro
            mostra-se o que vai entrar.
          </p>
          <label className="pilula importar-escolher">
            Escolher o ficheiro
            <input
              type="file"
              accept=".csv,.txt,.xlsx"
              className="sr-only"
              onChange={e => escolher(e.target.files?.[0])}
            />
          </label>
        </>
      ) : (
        <>
          <div className="importar-mapa">
            <p className="campo-nome">Que coluna é qual</p>
            <div className="importar-colunas">
              {NOMES.map(nome => (
                <label key={nome} className="campo">
                  <span className="campo-nome">{nome === 'data' ? 'Data' : nome === 'valor' ? 'Valor' : 'Descrição'}</span>
                  <select
                    className="campo-escrita periodo-dia"
                    value={mapa?.[nome] ?? -1}
                    onChange={e => definirMapa(m => (m ? { ...m, [nome]: Number(e.target.value) } : m))}
                  >
                    <option value={-1}>—</option>
                    {(grelha[0] ?? []).map((c, i) => (
                      <option key={i} value={i}>
                        {(mapa?.cabecalho && c.trim()) || `coluna ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <label className="campo importar-cabecalho">
                <span className="campo-nome">Primeira linha</span>
                <button
                  type="button"
                  className="chip"
                  onClick={() => definirMapa(m => (m ? { ...m, cabecalho: !m.cabecalho } : m))}
                >
                  {mapa?.cabecalho ? 'é cabeçalho' : 'já são dados'}
                </button>
              </label>
            </div>
          </div>

          <p className="importar-conta">
            {candidatas.length === 0
              ? 'Nenhuma linha se percebeu — experimente trocar as colunas acima.'
              : `${novas.length} para entrar${arrumadas > 0 ? ` · ${arrumadas} arrumam-se sozinhas` : ''}${porAlocar > 0 ? ` · ${porAlocar} ficam por alocar` : ''}${repetidas > 0 ? ` · ${repetidas} já cá estavam` : ''}`}
          </p>

          {candidatas.length > 0 && (
            <>
              {porAlocar > 0 && (
                <label className="campo importar-categoria">
                  <span className="campo-nome">O que não se conhecer entra em</span>
                  <EscolhaDeCategoria
                    categorias={categorias}
                    valor={categoria}
                    aoEscolher={definirCategoria}
                    rotulo="Categoria de recurso"
                    vazio="por alocar — arruma-se depois"
                  />
                </label>
              )}

              <div className="importar-lista">
                {candidatas.slice(0, 60).map((c, i) => (
                  <div className="fila" key={i} data-feita={c.jaExiste || saltar.has(i) || undefined}>
                    <span className="fila-corpo">
                      <span className="fila-nome">{c.descricao || 'sem descrição'}</span>
                      <span className="fila-meta">
                        <span>{c.data.slice(8, 10)}/{c.data.slice(5, 7)}</span>
                        {c.regra?.categoria_id && (
                          <span className="movimento-cat">
                            {c.regra.nome ? `${c.regra.nome} → ` : ''}{porId.get(c.regra.categoria_id)?.nome}
                          </span>
                        )}
                        {/* Uma passagem entre contas entra no livro e não conta
                            para nada: mais vale dizê-lo antes de entrar. */}
                        {c.regra?.categoria_id
                          && porId.get(c.regra.categoria_id)?.natureza === 'transferencia'
                          && <span className="movimento-neutro">não conta</span>}
                        {!c.regra?.categoria_id && !c.jaExiste && <span className="importar-alocar">por alocar</span>}
                        {c.jaExiste && <span className="movimento-mes">já cá estava</span>}
                      </span>
                    </span>
                    <span className="fila-numero">{escreverEuros(c.valor_cents)}</span>
                    {!c.jaExiste && (
                      <button type="button" className="botao-texto"
                        onClick={() => definirSaltar(s => {
                          const n = new Set(s)
                          if (n.has(i)) n.delete(i); else n.add(i)
                          return n
                        })}>
                        {saltar.has(i) ? 'trazer' : 'deixar'}
                      </button>
                    )}
                  </div>
                ))}
                {candidatas.length > 60 && (
                  <p className="vazio">e mais {candidatas.length - 60} — entram todas na mesma.</p>
                )}
              </div>

              <button type="button" className="pilula" disabled={novas.length === 0 || aGuardar} onClick={guardar}>
                {aGuardar ? 'A trazer…' : `Trazer ${novas.length}`}
              </button>
            </>
          )}
        </>
      )}

      {erro && <p className="recado-erro" role="alert">{erro}</p>}
    </section>
  )
}
