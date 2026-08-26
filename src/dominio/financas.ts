import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { esquemaAtrasado, supabase } from './supabase'
import {
  calcularRitmo, entradaDe, eTransferencia, gastoDe, pressaoDe,
  type Natureza, type Ritmo,
} from './dinheiro'
import type { Fornecedor } from './fornecedores'

export interface Categoria {
  id: string
  nome: string
  /** A categoria de que esta é parte. Nula = categoria de raiz. */
  mae_id?: string | null
  natureza: Natureza
  cor: string
  icone: string
  limite_cents: number | null
  ordem: number
  arquivada: boolean
}

export interface Compromisso {
  id: string
  nome: string
  fornecedor: string | null
  valor_cents: number
  dia_do_mes: number
  categoria_id: string | null
  activo: boolean
}

export interface Movimento {
  id: string
  data: string
  valor_cents: number
  descricao: string
  categoria_id: string | null
  fornecedor: string | null
  autor: string | null
  compromisso_id: string | null
  mes_conta_manual: string | null
  mes_conta: string
  impressao: string | null
}

export interface ParteDoEnvelope {
  categoria: Categoria
  gasto: number
  quantos: number
  limite: number | null
  pressao: number
}

export interface Envelope {
  categoria: Categoria
  /**
   * O que a árvore inteira moveu este mês: a categoria e as suas partes.
   * Numa categoria de entrada é o que entrou, não o que saiu.
   */
  gasto: number
  limite: number | null
  /** O tecto veio da soma das partes e não se edita na mãe. */
  limiteSomado: boolean
  pressao: number
  quantos: number
  /** As subcategorias, cada uma com o seu mês e o seu tecto. */
  filhos: ParteDoEnvelope[]
}

/**
 * Os três números do mês.
 *
 * O real ao lado do previsto, e a diferença dita por extenso. O previsto
 * da despesa são os envelopes mais os compromissos: o que é variável e o
 * que já está prometido, que é como a casa decide.
 */
export interface Resumo {
  entrou: number
  previstoEntrada: number
  saiu: number
  previstoSaida: number
  sobra: number
  sobraPrevista: number
  /** Quantos movimentos ainda podem mudar estes números. */
  porAlocar: number
  /** Quantas transferências entre contas ficaram de fora das contas. */
  transferencias: number
}

export type EstadoFinancas = 'a-carregar' | 'pronto' | 'sem-rede' | 'sem-migracao'

/** O primeiro dia do mês, que é como um mês se guarda. */
export const chaveDoMes = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`

export const mesDeChave = (c: string) => {
  const [a, m] = c.split('-').map(Number)
  return new Date(a, (m ?? 1) - 1, 1)
}

export const nomeDoMes = (d: Date) =>
  new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(d)

/** Um movimento com a natureza da sua categoria já à mão. */
export type MovimentoContado = Movimento & { natureza: Natureza | null }

/**
 * Os envelopes de uma natureza.
 *
 * O envelope é a árvore: um gasto na subcategoria "Renda" é um gasto de
 * "Casa" — é assim que a folha de cálculo da família somava. As entradas
 * fazem-se pela mesma forma, só que do outro lado: o "tecto" de uma
 * entrada é o que se espera receber.
 *
 * Função pura de propósito: é aqui que estão as contas que a página
 * mostra, e contas que não se podem provar sozinhas acabam a mentir.
 */
export function construirEnvelopes(
  categorias: Categoria[],
  movimentos: MovimentoContado[],
  limiteDe: (c: Categoria) => number | null,
  raizDe: Map<string, string>,
  natureza: 'despesa' | 'entrada',
): Envelope[] {
  const conta = natureza === 'entrada' ? entradaDe : gastoDe
  return categorias
    .filter(c => c.natureza === natureza && !c.arquivada && !c.mae_id)
    .map(categoria => {
      const daArvore = movimentos.filter(m =>
        m.categoria_id != null && raizDe.get(m.categoria_id) === categoria.id && !m.compromisso_id)
      const gasto = conta(daArvore)
      const filhos: ParteDoEnvelope[] = categorias
        .filter(c => c.mae_id === categoria.id && !c.arquivada)
        .map(filha => {
          const seus = daArvore.filter(m => m.categoria_id === filha.id)
          const seu = conta(seus)
          const limite = limiteDe(filha)
          return { categoria: filha, gasto: seu, quantos: seus.length, limite, pressao: pressaoDe(seu, limite) }
        })
        .sort((a, b) => b.gasto - a.gasto)
      /* Quem põe 700 na Renda e 120 na Luz já disse que a Casa são 820: o
         tecto da mãe é a soma das partes e deixa de se editar à mão. Dois
         números a dizerem coisas diferentes sobre o mesmo envelope é como
         uma folha de cálculo começa a mentir. */
      const dosFilhos = filhos.map(f => f.limite).filter((v): v is number => v != null)
      const limiteSomado = dosFilhos.length > 0
      const limite = limiteSomado
        ? dosFilhos.reduce((s, v) => s + v, 0)
        : limiteDe(categoria)
      return {
        categoria, gasto, limite, limiteSomado,
        pressao: pressaoDe(gasto, limite), quantos: daArvore.length, filhos,
      }
    })
    /* A despesa ordena-se por pressão: o que está mais perto de rebentar
       lê-se primeiro — uma lista alfabética faz o leitor procurar o
       problema, esta entrega-lho. A entrada segue a ordem da casa: o
       ordenado antes dos extras, sempre no mesmo sítio. */
    .sort((a, b) => (natureza === 'despesa'
      ? b.pressao - a.pressao || a.categoria.ordem - b.categoria.ordem
      : a.categoria.ordem - b.categoria.ordem))
}

/**
 * As contas de um mês.
 *
 * Tudo o que a página precisa sai daqui já contado: os envelopes por
 * pressão, o ritmo, o que entrou e o que está comprometido. A contagem vive
 * no domínio e não na página — foi a lição da semana e do início, que
 * discordaram por contarem os dias cada um à sua maneira.
 */
export function useFinancas(casaId: string | null, mes: string) {
  const [categorias, definirCategorias] = useState<Categoria[]>([])
  const [compromissos, definirCompromissos] = useState<Compromisso[]>([])
  const [movimentos, definirMovimentos] = useState<Movimento[]>([])
  const [limites, definirLimites] = useState<Record<string, number>>({})
  const [fornecedores, definirFornecedores] = useState<Fornecedor[]>([])
  /* A tabela pode ainda não existir (migração nona por correr): a página
     funciona sem regras, só não arruma sozinha. */
  const [semFornecedores, definirSemFornecedores] = useState(false)
  const [estado, definirEstado] = useState<EstadoFinancas>('a-carregar')
  const [falhou, definirFalhou] = useState(false)
  const relogio = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback(async () => {
    if (!casaId) return
    const [cats, comps, movs, orcs, forns] = await Promise.all([
      supabase.from('categorias').select('*').eq('casa_id', casaId).order('ordem'),
      supabase.from('compromissos').select('*').eq('casa_id', casaId).eq('activo', true),
      supabase.from('movimentos').select('*').eq('casa_id', casaId).eq('mes_conta', mes),
      supabase.from('orcamentos').select('categoria_id, limite_cents').eq('casa_id', casaId).eq('mes', mes),
      supabase.from('fornecedores').select('*').eq('casa_id', casaId).order('chave'),
    ])
    const erro = cats.error ?? comps.error ?? movs.error ?? orcs.error
    if (erro) {
      definirEstado(esquemaAtrasado(erro) ? 'sem-migracao' : 'sem-rede')
      return
    }
    if (forns.error) {
      definirSemFornecedores(esquemaAtrasado(forns.error))
    } else {
      definirFornecedores((forns.data ?? []) as Fornecedor[])
      definirSemFornecedores(false)
    }
    definirCategorias((cats.data ?? []) as Categoria[])
    definirCompromissos((comps.data ?? []) as Compromisso[])
    definirMovimentos((movs.data ?? []) as Movimento[])
    definirLimites(Object.fromEntries(
      (orcs.data ?? []).map((o: { categoria_id: string; limite_cents: number }) => [o.categoria_id, o.limite_cents]),
    ))
    definirEstado('pronto')
  }, [casaId, mes])

  useEffect(() => { definirEstado('a-carregar'); buscar() }, [buscar])

  const buscarEmBreve = useCallback(() => {
    if (relogio.current) clearTimeout(relogio.current)
    relogio.current = setTimeout(() => buscar(), 400)
  }, [buscar])

  useEffect(() => {
    if (!casaId) return
    const canal = supabase
      .channel(`financas:${casaId}:${mes}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movimentos', filter: `casa_id=eq.${casaId}` }, buscarEmBreve)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias', filter: `casa_id=eq.${casaId}` }, buscarEmBreve)
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [casaId, mes, buscarEmBreve])

  useEffect(() => () => { if (relogio.current) clearTimeout(relogio.current) }, [])

  /** O limite que vale este mês: o do mês, ou o normal da categoria. */
  const limiteDe = useCallback(
    (c: Categoria) => limites[c.id] ?? c.limite_cents,
    [limites],
  )

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, Categoria>()
    for (const c of categorias) mapa.set(c.id, c)
    return mapa
  }, [categorias])

  /** Cada movimento com a natureza da sua categoria à mão, para as contas. */
  const comNatureza = useMemo(
    () => movimentos.map(m => ({
      ...m,
      natureza: m.categoria_id ? porCategoria.get(m.categoria_id)?.natureza ?? null : null,
    })),
    [movimentos, porCategoria],
  )

  /** De qualquer categoria para a sua raiz: é por aqui que a árvore soma. */
  const raizDe = useMemo(() => {
    const mapa = new Map<string, string>()
    for (const c of categorias) mapa.set(c.id, c.mae_id ?? c.id)
    return mapa
  }, [categorias])

  const construir = useCallback(
    (natureza: 'despesa' | 'entrada') =>
      construirEnvelopes(categorias, comNatureza, limiteDe, raizDe, natureza),
    [categorias, comNatureza, limiteDe, raizDe],
  )

  const envelopes: Envelope[] = useMemo(() => construir('despesa'), [construir])
  const entradas: Envelope[] = useMemo(() => construir('entrada'), [construir])

  /** O corredor mede só o variável: os compromissos ficam de fora. */
  const variaveis = useMemo(() => comNatureza.filter(m => !m.compromisso_id), [comNatureza])

  const orcamentoTotal = useMemo(
    () => envelopes.reduce((s, e) => s + (e.limite ?? 0), 0),
    [envelopes],
  )

  const ritmo: Ritmo = useMemo(
    () => calcularRitmo(gastoDe(variaveis), orcamentoTotal, new Date(), mesDeChave(mes)),
    [variaveis, orcamentoTotal, mes],
  )

  const entrou = useMemo(() => entradaDe(comNatureza), [comNatureza])

  /** O que se espera receber: a soma dos envelopes de entrada. */
  const previstoEntrada = useMemo(
    () => entradas.reduce((s, e) => s + (e.limite ?? 0), 0),
    [entradas],
  )

  /** Um compromisso está pago quando há um movimento seu neste mês. */
  const pagamentos = useMemo(() => {
    const mapa = new Map<string, Movimento>()
    for (const m of movimentos) if (m.compromisso_id) mapa.set(m.compromisso_id, m)
    return mapa
  }, [movimentos])

  const comprometido = useMemo(
    () => compromissos.reduce((s, c) => s + c.valor_cents, 0),
    [compromissos],
  )

  const porPagar = useMemo(
    () => compromissos.filter(c => !pagamentos.has(c.id)).reduce((s, c) => s + c.valor_cents, 0),
    [compromissos, pagamentos],
  )

  /**
   * Os três números do mês, reais ao lado dos previstos.
   *
   * "Saiu" é tudo o que saiu, compromissos incluídos — é o que a conta
   * bancária viu. O previsto é a soma das duas decisões da casa: os
   * envelopes (o variável) e os compromissos (o que já está prometido).
   * As transferências entre contas não estão em lado nenhum destes
   * números: mudaram de bolso, não mudaram de dono.
   */
  const resumo: Resumo = useMemo(() => {
    const saiu = gastoDe(comNatureza)
    const previstoSaida = orcamentoTotal + comprometido
    return {
      entrou, previstoEntrada, saiu, previstoSaida,
      sobra: entrou - saiu,
      sobraPrevista: previstoEntrada - previstoSaida,
      porAlocar: comNatureza.filter(m => !m.categoria_id).length,
      transferencias: comNatureza.filter(eTransferencia).length,
    }
  }, [comNatureza, entrou, previstoEntrada, orcamentoTotal, comprometido])

  /* ---------------- escrever ---------------- */

  const comCasa = <T,>(linha: T) => ({ ...linha, casa_id: casaId })

  const registar = useCallback(async (m: Partial<Movimento>) => {
    if (!casaId) return
    const { error } = await supabase.from('movimentos').insert(comCasa(m))
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId])

  const alterarMovimento = useCallback(async (id: string, mudanca: Partial<Movimento>) => {
    definirMovimentos(ms => ms.map(m => (m.id === id ? { ...m, ...mudanca } : m)))
    const { error } = await supabase.from('movimentos').update(mudanca).eq('id', id)
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar])

  const apagarMovimento = useCallback(async (id: string) => {
    definirMovimentos(ms => ms.filter(m => m.id !== id))
    const { error } = await supabase.from('movimentos').delete().eq('id', id)
    definirFalhou(Boolean(error))
  }, [])

  const guardarCategoria = useCallback(async (c: Partial<Categoria> & { id?: string }) => {
    if (!casaId) return
    const { error } = c.id
      ? await supabase.from('categorias').update(c).eq('id', c.id)
      : await supabase.from('categorias').insert(comCasa(c))
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId])

  /** O tecto deste mês. Guardar o mesmo da categoria é tirar a excepção. */
  const definirLimiteDoMes = useCallback(async (categoriaId: string, cents: number | null) => {
    if (!casaId) return
    const { error } = cents === null
      ? await supabase.from('orcamentos').delete().eq('categoria_id', categoriaId).eq('mes', mes)
      : await supabase.from('orcamentos')
          .upsert({ casa_id: casaId, categoria_id: categoriaId, mes, limite_cents: cents },
                  { onConflict: 'categoria_id,mes' })
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId, mes])

  const guardarCompromisso = useCallback(async (c: Partial<Compromisso> & { id?: string }) => {
    if (!casaId) return
    const { error } = c.id
      ? await supabase.from('compromissos').update(c).eq('id', c.id)
      : await supabase.from('compromissos').insert(comCasa(c))
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId])

  const guardarFornecedor = useCallback(async (f: Partial<Fornecedor> & { id?: string }) => {
    if (!casaId) return
    const { error } = f.id
      ? await supabase.from('fornecedores').update(f).eq('id', f.id)
      : await supabase.from('fornecedores')
          .upsert({ ...f, casa_id: casaId }, { onConflict: 'casa_id,chave' })
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId])

  const apagarFornecedor = useCallback(async (id: string) => {
    definirFornecedores(fs => fs.filter(f => f.id !== id))
    const { error } = await supabase.from('fornecedores').delete().eq('id', id)
    definirFalhou(Boolean(error))
  }, [])

  const semear = useCallback(async () => {
    const { error } = await supabase.rpc('semear_categorias')
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar])

  return {
    estado, falhou, limparFalha: () => definirFalhou(false), recarregar: buscar,
    categorias, compromissos, movimentos, envelopes, entradas, ritmo, entrou, resumo,
    comprometido, porPagar, pagamentos, orcamentoTotal, limiteDe, porCategoria,
    raizDe, fornecedores, semFornecedores,
    registar, alterarMovimento, apagarMovimento, guardarFornecedor, apagarFornecedor,
    guardarCategoria, definirLimiteDoMes, guardarCompromisso, semear,
  }
}


/* ------------------------------------------------------------------ */

export interface LinhaDoAno {
  categoria: Categoria
  /** 12 posições, cêntimos gastos (ou entrados) por mês em que conta. */
  meses: number[]
  total: number
  filhos?: LinhaDoAno[]
}

export interface Ano {
  estado: EstadoFinancas
  despesas: LinhaDoAno[]
  entradas: LinhaDoAno[]
  totalDespesa: number[]
  totalEntrada: number[]
  /** Transferências entre contas do ano: contadas, nunca somadas. */
  transferencias: number
  /** Sobre quantos meses faz sentido tirar a média este ano. */
  mesesDecorridos: number
  recarregar: () => void
}

/**
 * O ano inteiro, categoria a mês — a folha que a família já tinha, com as
 * contas feitas por nós. Aqui entram TODOS os movimentos, os dos
 * compromissos incluídos: isto é o relatório do que aconteceu, não o
 * corredor do que ainda se decide. A renda pertence ao ano de "Casa".
 */
export function useAno(casaId: string | null, ano: number, categorias: Categoria[]): Ano {
  const [movimentos, definirMovimentos] = useState<Pick<Movimento, 'valor_cents' | 'categoria_id' | 'mes_conta'>[]>([])
  const [estado, definirEstado] = useState<EstadoFinancas>('a-carregar')

  const buscar = useCallback(async () => {
    if (!casaId) return
    const { data, error } = await supabase
      .from('movimentos')
      .select('valor_cents, categoria_id, mes_conta')
      .eq('casa_id', casaId)
      .gte('mes_conta', `${ano}-01-01`)
      .lte('mes_conta', `${ano}-12-01`)
    if (error) {
      definirEstado(esquemaAtrasado(error) ? 'sem-migracao' : 'sem-rede')
      return
    }
    definirMovimentos(data ?? [])
    definirEstado('pronto')
  }, [casaId, ano])

  useEffect(() => { definirEstado('a-carregar'); buscar() }, [buscar])

  return useMemo(() => {
    const porCategoria = new Map<string, number[]>()
    const semCategoria = { despesa: Array(12).fill(0) as number[], entrada: Array(12).fill(0) as number[] }
    const natureza = new Map(categorias.map(c => [c.id, c.natureza]))
    let transferencias = 0

    for (const m of movimentos) {
      const mes = Number(m.mes_conta.slice(5, 7)) - 1
      if (mes < 0 || mes > 11) continue
      const nat = m.categoria_id ? natureza.get(m.categoria_id) : undefined
      /* O dinheiro que muda de bolso não é ano nenhum: conta-se para se
         poder dizer que ficou de fora, e mais nada. */
      if (nat === 'transferencia') { transferencias += 1; continue }
      /* Um positivo numa despesa é um estorno: desconta. Um movimento sem
         categoria conta na natureza do seu sinal — não desaparece do ano. */
      if (!m.categoria_id || !nat) {
        if (m.valor_cents < 0) semCategoria.despesa[mes] += -m.valor_cents
        else semCategoria.entrada[mes] += m.valor_cents
        continue
      }
      const linha = porCategoria.get(m.categoria_id) ?? Array(12).fill(0)
      linha[mes] += nat === 'despesa' ? -m.valor_cents : m.valor_cents
      porCategoria.set(m.categoria_id, linha)
    }

    const somar = (a: number[], b: number[]) => a.map((v, i) => v + b[i])
    const linhaDe = (c: Categoria): LinhaDoAno => {
      const meses = porCategoria.get(c.id) ?? Array(12).fill(0)
      return { categoria: c, meses, total: meses.reduce((s, v) => s + v, 0) }
    }

    const arvore = (nat: 'despesa' | 'entrada'): LinhaDoAno[] =>
      categorias
        .filter(c => c.natureza === nat && !c.mae_id && !c.arquivada)
        .map(raiz => {
          const filhos = categorias
            .filter(c => c.mae_id === raiz.id && !c.arquivada)
            .map(linhaDe)
            .filter(f => f.total !== 0)
            .sort((a, b) => b.total - a.total)
          const propria = linhaDe(raiz)
          const meses = filhos.reduce((acc, f) => somar(acc, f.meses), propria.meses)
          return {
            categoria: raiz,
            meses,
            total: meses.reduce((s, v) => s + v, 0),
            filhos: filhos.length ? filhos : undefined,
          }
        })
        .filter(l => l.total !== 0)
        .sort((a, b) => b.total - a.total)

    const despesas = arvore('despesa')
    const entradas = arvore('entrada')
    if (semCategoria.despesa.some(v => v !== 0)) {
      const meses = semCategoria.despesa
      despesas.push({
        categoria: { id: 'sem', nome: 'Sem categoria', natureza: 'despesa', cor: '#75705f', icone: 'saco', limite_cents: null, ordem: 999, arquivada: false },
        meses, total: meses.reduce((s, v) => s + v, 0),
      })
    }
    if (semCategoria.entrada.some(v => v !== 0)) {
      const meses = semCategoria.entrada
      entradas.push({
        categoria: { id: 'sem-e', nome: 'Sem categoria', natureza: 'entrada', cor: '#75705f', icone: 'moeda', limite_cents: null, ordem: 999, arquivada: false },
        meses, total: meses.reduce((s, v) => s + v, 0),
      })
    }

    const totalDe = (linhas: LinhaDoAno[]) =>
      linhas.reduce((acc, l) => somar(acc, l.meses), Array(12).fill(0) as number[])

    const agora = new Date()
    const mesesDecorridos =
      ano < agora.getFullYear() ? 12
      : ano > agora.getFullYear() ? 1
      : Math.max(1, agora.getMonth() + 1)

    return {
      estado, despesas, entradas,
      totalDespesa: totalDe(despesas),
      totalEntrada: totalDe(entradas),
      transferencias,
      mesesDecorridos,
      recarregar: buscar,
    }
  }, [movimentos, categorias, estado, ano, buscar])
}