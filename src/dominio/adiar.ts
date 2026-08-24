import { useCallback, useEffect, useRef } from 'react'

/**
 * Escrever é uma tecla de cada vez; gravar não precisa de ser.
 * Junta as alterações por chave e envia-as quando a mão pára.
 */
export function useAdiar<T>(enviar: (chave: string, junto: T) => void, espera = 600) {
  const pendentes = useRef(new Map<string, T>())
  const relogio = useRef<ReturnType<typeof setTimeout> | null>(null)

  const escoar = useCallback(() => {
    const lista = [...pendentes.current.entries()]
    pendentes.current.clear()
    for (const [chave, junto] of lista) enviar(chave, junto)
  }, [enviar])

  const adiar = useCallback((chave: string, parte: T) => {
    pendentes.current.set(chave, { ...(pendentes.current.get(chave) ?? {}), ...parte } as T)
    if (relogio.current) clearTimeout(relogio.current)
    relogio.current = setTimeout(escoar, espera)
  }, [escoar, espera])

  // sair da página não pode comer o que ficou por gravar
  useEffect(() => () => { if (relogio.current) { clearTimeout(relogio.current); escoar() } }, [escoar])

  return adiar
}

/** Dois pratos com o mesmo nome escrito de outra maneira são o mesmo prato. */
export const chaveDeNome = (s: string) =>
  s.trim().toLocaleLowerCase('pt').normalize('NFD').replace(/\p{Diacritic}/gu, '')
