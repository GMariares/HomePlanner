import { useEffect, useRef, useState } from 'react'

/**
 * O movimento da casa.
 *
 * Uma regra: nada se anima à chegada. Um número que rola quando a página
 * abre é decoração e atrasa a leitura; o mesmo número a rolar quando o
 * gasto acabou de ser registado é a consequência à vista — que é, desde o
 * princípio, a recompensa de registar.
 */

/** Quem pediu menos movimento ao sistema recebe menos movimento. */
export function useMovimentoReduzido() {
  const [reduzido, definirReduzido] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const consulta = matchMedia('(prefers-reduced-motion: reduce)')
    const ouvir = () => definirReduzido(consulta.matches)
    consulta.addEventListener('change', ouvir)
    return () => consulta.removeEventListener('change', ouvir)
  }, [])
  return reduzido
}

/**
 * Um número que anda até ao seu valor novo — e só quando ele muda.
 *
 * Monta no valor final: uma página que abre não conta nada. A partir daí,
 * cada mudança corre do que estava para o que está, com desaceleração,
 * e uma mudança a meio de outra parte de onde o olho a deixou.
 */
export function useContagem(alvo: number, ms = 450) {
  const reduzido = useMovimentoReduzido()
  const [mostrado, definirMostrado] = useState(alvo)
  const actual = useRef(alvo)
  const anterior = useRef(alvo)

  useEffect(() => {
    if (reduzido || anterior.current === alvo) {
      anterior.current = alvo
      actual.current = alvo
      definirMostrado(alvo)
      return
    }
    const partida = actual.current
    anterior.current = alvo
    const inicio = performance.now()
    let quadro = 0
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / ms)
      const suave = 1 - Math.pow(1 - t, 3)
      const v = Math.round(partida + (alvo - partida) * suave)
      actual.current = v
      definirMostrado(v)
      if (t < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [alvo, ms, reduzido])

  return mostrado
}

/**
 * O que este valor era, enquanto a mudança ainda se vê.
 *
 * Serve para desenhar o golpe: a barra sabe onde estava e onde está, e o
 * pedaço entre as duas coisas é exactamente o tamanho do gasto que
 * acabou de entrar. Nunca dispara à montagem.
 */
export function useMudanca(valor: number, ms = 700) {
  const reduzido = useMovimentoReduzido()
  const [estado, definirEstado] = useState({ anterior: valor, aMudar: false })
  const ultimo = useRef(valor)
  const relogio = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (ultimo.current === valor) return
    if (reduzido) { ultimo.current = valor; return }
    const anterior = ultimo.current
    ultimo.current = valor
    definirEstado({ anterior, aMudar: true })
    if (relogio.current) clearTimeout(relogio.current)
    relogio.current = setTimeout(() => definirEstado(e => ({ ...e, aMudar: false })), ms)
  }, [valor, ms, reduzido])

  useEffect(() => () => { if (relogio.current) clearTimeout(relogio.current) }, [])
  return estado
}
