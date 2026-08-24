import { useRef, type FocusEvent } from 'react'

/**
 * Uma linha por escrever fecha-se quando se sai dela — nunca ao passar de um
 * campo para o outro dentro dela.
 *
 * Fechar no blur de um campo é o erro que fazia o Tab arquivar a linha sem a
 * quantidade, e mandava a quantidade escrita a seguir para a linha de baixo.
 * A regra vive aqui uma vez em vez de sete vezes espalhadas.
 */
export function useRascunho(fechar: () => void) {
  const linha = useRef<HTMLDivElement>(null)

  const aoPerderFoco = (e: FocusEvent<HTMLElement>) => {
    if (linha.current?.contains(e.relatedTarget as Node | null)) return
    fechar()
  }

  return { linha, aoPerderFoco }
}
