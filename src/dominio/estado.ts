import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { daBaseDeDados, paraBaseDeDados, type Entrada, type EntradaDb } from './tipos'
import { exemploDaSemana } from './exemplo'
import { esquemaAtrasado, supabase } from './supabase'
import { chaveDeData, dataDeChave, somarDias } from './semana'

const CACHE = 'homeplanner:cache'

export const novoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.floor(Math.random() * 1e9).toString(16)}`

export type EstadoDaSemana = 'a-carregar' | 'pronto' | 'sem-rede' | 'sem-migracao'

const chaveCache = (casaId: string, semana: string) => `${CACHE}:${casaId}:${semana}`

function lerCache(casaId: string, semana: string): Entrada[] | null {
  try {
    const cru = localStorage.getItem(chaveCache(casaId, semana))
    return cru ? (JSON.parse(cru) as Entrada[]) : null
  } catch { return null }
}

function guardarCache(casaId: string, semana: string, entradas: Entrada[]) {
  try { localStorage.setItem(chaveCache(casaId, semana), JSON.stringify(entradas)) } catch { /* sem espaço */ }
}

/**
 * A semana vive no Supabase e fica em cache no aparelho.
 *
 * O que se escreve aparece já na página e só depois vai à rede: às 7:40 da
 * manhã, numa cozinha com mau sinal, ninguém deve esperar por um servidor
 * para ver o que escreveu. Se a gravação falhar, a página di-lo em vez de
 * fingir que correu bem.
 */
export function useSemana(casaId: string | null, semana: string) {
  const [entradas, definir] = useState<Entrada[]>(() =>
    casaId ? lerCache(casaId, semana) ?? [] : [],
  )
  const [estado, definirEstado] = useState<EstadoDaSemana>('a-carregar')
  const [falhouAoGuardar, definirFalha] = useState(false)
  const [semPeriodos, definirSemPeriodos] = useState(false)

  // O texto muda a cada tecla; a rede não precisa de saber a cada tecla.
  const porGravar = useRef(new Map<string, Partial<Entrada>>())
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback(async () => {
    if (!casaId) return
    const domingo = chaveDeData(somarDias(dataDeChave(semana), 6))

    /* A semana lê-se por sobreposição, não por igualdade: uma viagem que
       começa num sábado e acaba na quarta seguinte pertence às duas semanas,
       e é uma linha só. O que não tem dia marcado continua preso à sua. */
    const { data, error } = await supabase
      .from('entradas')
      .select('*')
      .eq('casa_id', casaId)
      .or(
        `and(dia.is.null,semana.eq.${semana}),` +
        `and(inicio_data.lte.${domingo},fim_efectivo.gte.${semana})`,
      )

    if (!error) {
      const lidas = (data as EntradaDb[]).map(daBaseDeDados)
      definir(lidas)
      guardarCache(casaId, semana, lidas)
      definirEstado('pronto')
      definirSemPeriodos(false)
      return
    }

    /* Entre publicar e correr o SQL, as colunas do período ainda não existem.
       A semana abre à mesma, sem períodos, e a página di-lo. */
    if (esquemaAtrasado(error)) {
      const antiga = await supabase
        .from('entradas')
        .select('*')
        .eq('casa_id', casaId)
        .eq('semana', semana)
      if (!antiga.error) {
        const lidas = (antiga.data as EntradaDb[]).map(daBaseDeDados)
        definir(lidas)
        guardarCache(casaId, semana, lidas)
        definirEstado('pronto')
        definirSemPeriodos(true)
        return
      }
      definirEstado(esquemaAtrasado(antiga.error) ? 'sem-migracao' : 'sem-rede')
      return
    }
    definirEstado('sem-rede')
  }, [casaId, semana])

  useEffect(() => {
    if (!casaId) return
    definir(lerCache(casaId, semana) ?? [])
    definirEstado('a-carregar')
    buscar()
  }, [casaId, semana, buscar])

  // Tempo real: o que o telemóvel escreve aparece no PC sem ninguém recarregar.
  useEffect(() => {
    if (!casaId) return
    const canal = supabase
      .channel(`entradas:${casaId}:${semana}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entradas', filter: `casa_id=eq.${casaId}` },
        () => { if (porGravar.current.size === 0) buscar() },
      )
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [casaId, semana, buscar])

  const escoar = useCallback(async () => {
    const pendentes = [...porGravar.current.entries()]
    porGravar.current.clear()
    let falhou = false
    for (const [id, mudanca] of pendentes) {
      const { error } = await supabase.from('entradas').update(paraBaseDeDados(mudanca)).eq('id', id)
      if (error) falhou = true
    }
    definirFalha(falhou)
  }, [])

  const agendar = useCallback((id: string, mudanca: Partial<Entrada>) => {
    const jaPendente = porGravar.current.get(id) ?? {}
    porGravar.current.set(id, { ...jaPendente, ...mudanca })
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(escoar, 600)
  }, [escoar])

  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current) }, [])

  const guardarLocal = useCallback((proximas: Entrada[]) => {
    definir(proximas)
    if (casaId) guardarCache(casaId, semana, proximas)
  }, [casaId, semana])

  const alterar = useCallback((id: string, mudanca: Partial<Entrada>) => {
    definir(es => {
      const proximas = es.map(e => (e.id === id ? { ...e, ...mudanca } : e))
      if (casaId) guardarCache(casaId, semana, proximas)
      return proximas
    })
    agendar(id, mudanca)
  }, [agendar, casaId, semana])

  const acrescentar = useCallback(async (entrada: Entrada) => {
    if (!casaId) return
    definir(es => {
      const proximas = [...es, entrada]
      guardarCache(casaId, semana, proximas)
      return proximas
    })
    const { error } = await supabase
      .from('entradas')
      .insert({ ...paraBaseDeDados(entrada), id: entrada.id, casa_id: casaId, semana })
    definirFalha(Boolean(error))
  }, [casaId, semana])

  const apagar = useCallback(async (id: string) => {
    definir(es => {
      const proximas = es.filter(e => e.id !== id)
      if (casaId) guardarCache(casaId, semana, proximas)
      return proximas
    })
    porGravar.current.delete(id)
    const { error } = await supabase.from('entradas').delete().eq('id', id)
    definirFalha(Boolean(error))
  }, [casaId, semana])

  /** Mover deixa a linha riscada onde estava. A agenda guarda o que aconteceu. */
  const mover = useCallback(async (id: string, destino: number | null) => {
    if (!casaId) return
    const original = entradas.find(e => e.id === id)
    if (!original || original.dia === destino) return

    /* Mover um período move-o inteiro: o fim anda os mesmos dias que o
       princípio, senão a viagem encurtava sozinha ao mudar de dia. */
    const passo = destino === null || original.dia === null ? 0 : destino - original.dia
    const fimMovido = original.fimData && passo !== 0
      ? chaveDeData(somarDias(dataDeChave(original.fimData), passo))
      : original.fimData ?? null
    /* Sem dia não há período: o que vai para "esta semana" perde o fim. */
    const fimFinal = destino === null ? null : fimMovido

    const fantasma: Entrada = {
      ...original,
      id: novoId(),
      riscada: true,
      movidaPara: destino,
      extensao: undefined,
      fimData: null,
    }
    const movida: Entrada = { ...original, dia: destino, extensao: undefined, fimData: fimFinal }
    guardarLocal(entradas.flatMap(e => (e.id === id ? [fantasma, movida] : [e])))

    const [inserida, actualizada] = await Promise.all([
      supabase.from('entradas').insert({ ...paraBaseDeDados(fantasma), id: fantasma.id, casa_id: casaId, semana }),
      supabase.from('entradas').update(paraBaseDeDados({ dia: destino, fimData: fimFinal })).eq('id', id),
    ])
    definirFalha(Boolean(inserida.error || actualizada.error))
  }, [casaId, entradas, guardarLocal, semana])

  /** Escreve o exemplo na caderneta a sério — só quando alguém pede. */
  const escreverExemplo = useCallback(async () => {
    if (!casaId) return
    const linhas = exemploDaSemana(semana).map(e => ({ ...e, id: novoId() }))
    guardarLocal(linhas)
    const { error } = await supabase
      .from('entradas')
      .insert(linhas.map(e => ({ ...paraBaseDeDados(e), id: e.id, casa_id: casaId, semana })))
    definirFalha(Boolean(error))
    if (!error) buscar()
  }, [buscar, casaId, guardarLocal, semana])

  const vazia = useMemo(() => entradas.length === 0, [entradas])

  return { entradas, estado, vazia, falhouAoGuardar, semPeriodos, alterar, acrescentar, apagar, mover, escreverExemplo }
}
