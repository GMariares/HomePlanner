import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, semTabelas } from './supabase'
import { novoId } from './estado'
import { useAdiar } from './adiar'
import type { Compra, Entrada, EntradaDb, Ingrediente, Prato } from './tipos'
import { daBaseDeDados } from './tipos'

export type EstadoDaEmenta = 'a-carregar' | 'pronto' | 'sem-rede' | 'sem-migracao'

/**
 * A ementa da semana, o livro dos pratos, e a lista que sai de um e de outro.
 *
 * A regra que dá sentido a esta página: marcar um prato num dia põe os
 * ingredientes na lista; tirá-lo tira-os outra vez. O que já foi comprado ou
 * mexido à mão fica — e essa parte é o gatilho na base de dados que garante,
 * porque o jantar também se apaga a partir da semana.
 */
export function useEmenta(casaId: string | null, semana: string) {
  const [jantares, definirJantares] = useState<Entrada[]>([])
  const [pratos, definirPratos] = useState<Prato[]>([])
  const [compras, definirCompras] = useState<Compra[]>([])
  const [estado, definirEstado] = useState<EstadoDaEmenta>('a-carregar')
  const [falhou, definirFalhou] = useState(false)

  const buscar = useCallback(async () => {
    if (!casaId) return
    const [ent, prt, ing, cmp] = await Promise.all([
      supabase.from('entradas').select('*').eq('casa_id', casaId).eq('semana', semana).eq('genero', 'refeicao'),
      supabase.from('pratos').select('id, nome').eq('casa_id', casaId).order('nome'),
      supabase.from('ingredientes').select('*').eq('casa_id', casaId).order('ordem'),
      supabase.from('compras').select('*, pratos(nome)').eq('casa_id', casaId)
        .or(`comprado.eq.false,semana.eq.${semana}`).order('criada_em'),
    ])

    const erro = ent.error ?? prt.error ?? ing.error ?? cmp.error
    if (erro) { definirEstado(semTabelas(erro) ? 'sem-migracao' : 'sem-rede'); return }

    definirJantares((ent.data as EntradaDb[]).map(daBaseDeDados).filter(e => e.refeicao === 'jantar'))

    const porPrato = new Map<string, Ingrediente[]>()
    for (const i of (ing.data ?? []) as Ingrediente[]) {
      const lista = porPrato.get(i.prato_id) ?? []
      lista.push(i)
      porPrato.set(i.prato_id, lista)
    }
    definirPratos(((prt.data ?? []) as { id: string; nome: string }[]).map(p => ({
      ...p, ingredientes: porPrato.get(p.id) ?? [],
    })))

    definirCompras(((cmp.data ?? []) as (Compra & { pratos?: { nome: string } | null })[]).map(c => ({
      ...c, prato_nome: c.pratos?.nome ?? null,
    })))
    definirEstado('pronto')
  }, [casaId, semana])

  useEffect(() => { if (casaId) { definirEstado('a-carregar'); buscar() } }, [casaId, buscar])

  useEffect(() => {
    if (!casaId) return
    const canal = supabase
      .channel(`ementa:${casaId}:${semana}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'compras', filter: `casa_id=eq.${casaId}` }, () => buscar())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entradas', filter: `casa_id=eq.${casaId}` }, () => buscar())
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [casaId, semana, buscar])

  const jantarDe = useCallback((dia: number) => jantares.find(j => j.dia === dia) ?? null, [jantares])

  /** Põe na lista os ingredientes de um prato, atribuídos a este jantar. */
  const derivar = useCallback(async (entradaId: string, prato: Prato) => {
    if (!casaId || prato.ingredientes.length === 0) return
    const { error } = await supabase.from('compras').insert(
      prato.ingredientes.map(i => ({
        id: novoId(), casa_id: casaId, semana,
        nome: i.nome, quantidade: i.quantidade,
        origem_entrada_id: entradaId, prato_id: prato.id,
      })),
    )
    if (error) definirFalhou(true)
  }, [casaId, semana])

  /** Retira da lista o que este jantar lá pôs e ninguém comprou nem mexeu. */
  const retirar = useCallback(async (entradaId: string) => {
    await supabase.from('compras').delete()
      .eq('origem_entrada_id', entradaId).eq('comprado', false).eq('editado', false)
  }, [])

  const marcarJantar = useCallback(async (dia: number, prato: Prato | null, texto?: string) => {
    if (!casaId) return
    const existente = jantarDe(dia)
    const nome = prato?.nome ?? texto ?? ''

    if (existente) {
      await retirar(existente.id)
      if (!nome) {
        await supabase.from('entradas').delete().eq('id', existente.id)
      } else {
        await supabase.from('entradas').update({ texto: nome, prato_id: prato?.id ?? null }).eq('id', existente.id)
        if (prato) await derivar(existente.id, prato)
      }
    } else if (nome) {
      const id = novoId()
      const { error } = await supabase.from('entradas').insert({
        id, casa_id: casaId, semana, dia, genero: 'refeicao', refeicao: 'jantar',
        texto: nome, prato_id: prato?.id ?? null, autor: null, hora: null,
      })
      if (error) { definirFalhou(true); return }
      if (prato) await derivar(id, prato)
    }
    buscar()
  }, [buscar, casaId, derivar, jantarDe, retirar, semana])

  const criarPrato = useCallback(async (nome: string): Promise<Prato | null> => {
    if (!casaId || !nome.trim()) return null
    const id = novoId()
    const { error } = await supabase.from('pratos').insert({ id, casa_id: casaId, nome: nome.trim() })
    if (error) { definirFalhou(true); return null }
    const novo = { id, nome: nome.trim(), ingredientes: [] }
    definirPratos(ps => [...ps, novo].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')))
    return novo
  }, [casaId])

  const acrescentarIngrediente = useCallback(async (pratoId: string, nome: string, quantidade: string | null) => {
    if (!casaId || !nome.trim()) return
    const id = novoId()
    const prato = pratos.find(p => p.id === pratoId)
    const ordem = prato ? prato.ingredientes.length : 0
    const { error } = await supabase.from('ingredientes')
      .insert({ id, casa_id: casaId, prato_id: pratoId, nome: nome.trim(), quantidade, ordem })
    if (error) { definirFalhou(true); return }
    definirPratos(ps => ps.map(p => p.id === pratoId
      ? { ...p, ingredientes: [...p.ingredientes, { id, prato_id: pratoId, nome: nome.trim(), quantidade, ordem }] }
      : p))
  }, [casaId, pratos])

  const gravarIngrediente = useCallback((id: string, junto: Partial<Ingrediente>) => {
    supabase.from('ingredientes').update(junto).eq('id', id).then(({ error }) => {
      if (error) definirFalhou(true)
    })
  }, [])
  const adiarIngrediente = useAdiar<Partial<Ingrediente>>(gravarIngrediente)

  const alterarIngrediente = useCallback((id: string, mudanca: Partial<Ingrediente>) => {
    definirPratos(ps => ps.map(p => ({
      ...p, ingredientes: p.ingredientes.map(i => (i.id === id ? { ...i, ...mudanca } : i)),
    })))
    adiarIngrediente(id, mudanca)
  }, [adiarIngrediente])

  const apagarIngrediente = useCallback(async (id: string) => {
    definirPratos(ps => ps.map(p => ({ ...p, ingredientes: p.ingredientes.filter(i => i.id !== id) })))
    await supabase.from('ingredientes').delete().eq('id', id)
  }, [])

  const alternarComprado = useCallback(async (c: Compra) => {
    const agora = !c.comprado
    definirCompras(cs => cs.map(x => (x.id === c.id ? { ...x, comprado: agora } : x)))
    await supabase.from('compras')
      .update({ comprado: agora, comprado_em: agora ? new Date().toISOString() : null })
      .eq('id', c.id)
  }, [])

  const gravarCompra = useCallback((id: string, junto: Partial<Compra>) => {
    supabase.from('compras').update(junto).eq('id', id).then(({ error }) => {
      if (error) definirFalhou(true)
    })
  }, [])
  const adiarCompra = useAdiar<Partial<Compra>>(gravarCompra)

  /** Mexer à mão numa linha vinda de um prato faz dela uma linha da casa. */
  const alterarCompra = useCallback((c: Compra, mudanca: Partial<Compra>) => {
    const passaASerDaCasa = Boolean(c.origem_entrada_id) && !c.editado
    definirCompras(cs => cs.map(x => (x.id === c.id ? { ...x, ...mudanca, editado: x.editado || passaASerDaCasa } : x)))
    adiarCompra(c.id, { ...mudanca, ...(passaASerDaCasa ? { editado: true } : {}) })
  }, [adiarCompra])

  const acrescentarCompra = useCallback(async (nome: string, quantidade: string | null = null) => {
    if (!casaId || !nome.trim()) return
    const linha = { id: novoId(), casa_id: casaId, semana, nome: nome.trim(), quantidade }
    definirCompras(cs => [...cs, { ...linha, comprado: false, origem_entrada_id: null, prato_id: null, editado: false }])
    const { error } = await supabase.from('compras').insert(linha)
    if (error) definirFalhou(true)
  }, [casaId, semana])

  const apagarCompra = useCallback(async (id: string) => {
    definirCompras(cs => cs.filter(c => c.id !== id))
    await supabase.from('compras').delete().eq('id', id)
  }, [])

  const porComprar = useMemo(() => compras.filter(c => !c.comprado).length, [compras])

  return {
    jantares, pratos, compras, estado, falhou, porComprar,
    jantarDe, marcarJantar, criarPrato,
    acrescentarIngrediente, alterarIngrediente, apagarIngrediente,
    alternarComprado, alterarCompra, acrescentarCompra, apagarCompra,
  }
}
