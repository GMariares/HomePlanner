import { useCallback, useEffect, useState } from 'react'
import { semTabelas, supabase } from './supabase'
import { novoId } from './estado'
import { chaveDeNome, useAdiar } from './adiar'
import type { Ingrediente, Prato } from './tipos'

export type EstadoDoLivro = 'a-carregar' | 'pronto' | 'sem-rede' | 'sem-migracao'

/** O livro dos pratos da casa. Existe fora de qualquer semana — é o que a casa cozinha. */
export function useLivro(casaId: string | null) {
  const [pratos, definirPratos] = useState<Prato[]>([])
  const [estado, definirEstado] = useState<EstadoDoLivro>('a-carregar')
  const [recado, definirRecado] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    if (!casaId) return
    const [prt, ing] = await Promise.all([
      supabase.from('pratos').select('id, nome').eq('casa_id', casaId).order('nome'),
      supabase.from('ingredientes').select('*').eq('casa_id', casaId).order('ordem'),
    ])
    const erro = prt.error ?? ing.error
    if (erro) { definirEstado(semTabelas(erro) ? 'sem-migracao' : 'sem-rede'); return }

    const porPrato = new Map<string, Ingrediente[]>()
    for (const i of (ing.data ?? []) as Ingrediente[]) {
      const l = porPrato.get(i.prato_id) ?? []
      l.push(i); porPrato.set(i.prato_id, l)
    }
    definirPratos(((prt.data ?? []) as { id: string; nome: string }[])
      .map(p => ({ ...p, ingredientes: porPrato.get(p.id) ?? [] })))
    definirEstado('pronto')
  }, [casaId])

  useEffect(() => { if (casaId) { definirEstado('a-carregar'); buscar() } }, [casaId, buscar])

  const gravarIngrediente = useCallback((id: string, junto: Partial<Ingrediente>) => {
    supabase.from('ingredientes').update(junto).eq('id', id).then(({ error }) => {
      if (error) definirRecado('Não foi possível guardar. O que está escrito continua aqui.')
    })
  }, [])
  const adiarIngrediente = useAdiar<Partial<Ingrediente>>(gravarIngrediente)

  const gravarPrato = useCallback((id: string, junto: { nome?: string }) => {
    supabase.from('pratos').update(junto).eq('id', id).then(({ error }) => {
      if (error) {
        definirRecado(error.code === '23505'
          ? 'Já existe um prato com esse nome no livro.'
          : 'Não foi possível mudar o nome.')
        buscar()
      }
    })
  }, [buscar])
  const adiarPrato = useAdiar<{ nome?: string }>(gravarPrato)

  const criarPrato = useCallback(async (nome: string): Promise<Prato | null> => {
    const limpo = nome.trim()
    if (!casaId || !limpo) return null
    const jaExiste = pratos.find(p => chaveDeNome(p.nome) === chaveDeNome(limpo))
    if (jaExiste) {
      definirRecado(`“${jaExiste.nome}” já está no livro.`)
      return jaExiste
    }
    const id = novoId()
    const { error } = await supabase.from('pratos').insert({ id, casa_id: casaId, nome: limpo })
    if (error) {
      definirRecado(error.code === '23505'
        ? 'Já existe um prato com esse nome no livro.'
        : 'Não foi possível escrever o prato.')
      return null
    }
    definirRecado(null)
    const novo: Prato = { id, nome: limpo, ingredientes: [] }
    definirPratos(ps => [...ps, novo].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')))
    return novo
  }, [casaId, pratos])

  const renomearPrato = useCallback((id: string, nome: string) => {
    definirPratos(ps => ps.map(p => (p.id === id ? { ...p, nome } : p)))
    if (nome.trim()) adiarPrato(id, { nome: nome.trim() })
  }, [adiarPrato])

  /**
   * Apagar um prato não reescreve o passado: os jantares já marcados ficam com
   * o nome escrito, porque foi isso que se comeu. Só o prato sai do livro.
   */
  const apagarPrato = useCallback(async (id: string) => {
    definirPratos(ps => ps.filter(p => p.id !== id))
    const { error } = await supabase.from('pratos').delete().eq('id', id)
    if (error) { definirRecado('Não foi possível apagar o prato.'); buscar() }
  }, [buscar])

  const acrescentarIngrediente = useCallback(async (pratoId: string, nome: string, quantidade: string | null) => {
    const limpo = nome.trim()
    if (!casaId || !limpo) return
    const id = novoId()
    let ordem = 0
    definirPratos(ps => ps.map(p => {
      if (p.id !== pratoId) return p
      ordem = p.ingredientes.length
      return { ...p, ingredientes: [...p.ingredientes, { id, prato_id: pratoId, nome: limpo, quantidade, ordem }] }
    }))
    const { error } = await supabase.from('ingredientes')
      .insert({ id, casa_id: casaId, prato_id: pratoId, nome: limpo, quantidade, ordem })
    if (error) { definirRecado('Não foi possível guardar o ingrediente.'); buscar() }
  }, [buscar, casaId])

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

  return {
    pratos, estado, recado, limparRecado: () => definirRecado(null),
    criarPrato, renomearPrato, apagarPrato,
    acrescentarIngrediente, alterarIngrediente, apagarIngrediente,
  }
}
