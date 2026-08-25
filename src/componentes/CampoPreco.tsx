import { useEffect, useState } from 'react'
import { lerPreco } from './LinhaNova'

/** "1,2" não é um preço; "1,20" é. Mas só se arruma quando se sai do campo. */
export const escreverPreco = (n: number | null | undefined) =>
  n == null ? '' : n.toFixed(2).replace('.', ',')

export function CampoPreco({ valor, rotulo, aoMudar }: {
  valor: number | null
  rotulo: string
  aoMudar: (v: number | null) => void
}) {
  const [texto, definirTexto] = useState(() => escreverPreco(valor))

  // o que vem de fora manda, excepto enquanto se está a escrever
  useEffect(() => {
    if (document.activeElement?.getAttribute('aria-label') !== rotulo) {
      definirTexto(escreverPreco(valor))
    }
  }, [valor, rotulo])

  return (
    <input
      className="escrita escrita--num escrita--preco"
      value={texto}
      placeholder="€"
      inputMode="decimal"
      maxLength={10}
      aria-label={rotulo}
      onChange={e => { definirTexto(e.target.value); aoMudar(lerPreco(e.target.value)) }}
      onBlur={() => definirTexto(escreverPreco(lerPreco(texto)))}
    />
  )
}
