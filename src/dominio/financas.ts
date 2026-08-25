import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { esquemaAtrasado, supabase } from './supabase'
import { calcularRitmo, entradaDe, gastoDe, pressaoDe, type Ritmo } from './dinheiro'

export interface Categoria {
  id: string
  nome: string
  natureza: 'despesa' | 'entrada'
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

export interface Envelope {
  categoria: Categoria
  gasto: number
  limite: number | null
  pressao: number
  quantos: number
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
  const [estado, definirEstado] = useState<EstadoFinancas>('a-carregar')
  const [falhou, definirFalhou] = useState(false)
  const relogio = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback(async () => {
    if (!casaId) return
    const [cats, comps, movs, orcs] = await Promise.all([
      supabase.from('categorias').select('*').eq('casa_id', casaId).order('ordem'),
      supabase.from('compromissos').select('*').eq('casa_id', casaId).eq('activo', true),
      supabase.from('movimentos').select('*').eq('casa_id', casaId).eq('mes_conta', mes),
      supabase.from('orcamentos').select('categoria_id, limite_cents').eq('casa_id', casaId).eq('mes', mes),
    ])
    const erro = cats.error ?? comps.error ?? movs.error ?? orcs.error
    if (erro) {
      definirEstado(esquemaAtrasado(erro) ? 'sem-migracao' : 'sem-rede')
      return
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

  const envelopes: Envelope[] = useMemo(() => {
    const despesas = categorias.filter(c => c.natureza === 'despesa' && !c.arquivada)
    return despesas
      .map(categoria => {
        const seus = comNatureza.filter(m => m.categoria_id === categoria.id && !m.compromisso_id)
        const gasto = gastoDe(seus)
        const limite = limiteDe(categoria)
        return { categoria, gasto, limite, pressao: pressaoDe(gasto, limite), quantos: seus.length }
      })
      /* Por pressão: o que está mais perto de rebentar lê-se primeiro. Uma
         lista alfabética faz o leitor procurar o problema; esta entrega-lho. */
      .sort((a, b) => b.pressao - a.pressao || a.categoria.ordem - b.categoria.ordem)
  }, [categorias, comNatureza, limiteDe])

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

  const semear = useCallback(async () => {
    const { error } = await supabase.rpc('semear_categorias')
    definirFalhou(Boolean(error))
    if (!error) buscar()
  }, [buscar])

  return {
    estado, falhou, limparFalha: () => definirFalhou(false), recarregar: buscar,
    categorias, compromissos, movimentos, envelopes, ritmo, entrou,
    comprometido, porPagar, pagamentos, orcamentoTotal, limiteDe, porCategoria,
    registar, alterarMovimento, apagarMovimento,
    guardarCategoria, definirLimiteDoMes, guardarCompromisso, semear,
  }
}
