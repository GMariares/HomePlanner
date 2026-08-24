import { useCallback, useEffect, useState } from 'react'
import type { Entrada } from './tipos'
import { EXEMPLO } from './exemplo'

const CHAVE = 'homeplanner:semana:v1'

function carregar(chave: string): Entrada[] {
  try {
    const cru = localStorage.getItem(`${CHAVE}:${chave}`)
    if (cru) return JSON.parse(cru) as Entrada[]
  } catch {
    /* armazenamento indisponível: a semana abre com o exemplo */
  }
  return EXEMPLO
}

let contador = 0
export const novoId = () => `n${Date.now().toString(36)}${(contador++).toString(36)}`

export function useSemana(chave: string) {
  const [entradas, definir] = useState<Entrada[]>(() => carregar(chave))
  const [falhouAoGuardar, definirFalha] = useState(false)

  useEffect(() => { definir(carregar(chave)) }, [chave])

  useEffect(() => {
    try {
      localStorage.setItem(`${CHAVE}:${chave}`, JSON.stringify(entradas))
      definirFalha(false)
    } catch {
      definirFalha(true)
    }
  }, [chave, entradas])

  const alterar = useCallback((id: string, mudanca: Partial<Entrada>) => {
    definir(es => es.map(e => (e.id === id ? { ...e, ...mudanca } : e)))
  }, [])

  const acrescentar = useCallback((entrada: Entrada) => {
    definir(es => [...es, entrada])
  }, [])

  const apagar = useCallback((id: string) => {
    definir(es => es.filter(e => e.id !== id))
  }, [])

  /** Mover deixa a linha riscada onde estava. A agenda guarda o que aconteceu. */
  const mover = useCallback((id: string, destino: number | null) => {
    definir(es => {
      const original = es.find(e => e.id === id)
      if (!original || original.dia === destino) return es
      const fantasma: Entrada = {
        ...original,
        id: novoId(),
        riscada: true,
        movidaPara: destino,
        extensao: undefined,
      }
      return es.flatMap(e =>
        e.id === id ? [fantasma, { ...e, dia: destino, extensao: undefined }] : [e],
      )
    })
  }, [])

  const repor = useCallback(() => definir(EXEMPLO), [])

  return { entradas, alterar, acrescentar, apagar, mover, repor, falhouAoGuardar }
}
