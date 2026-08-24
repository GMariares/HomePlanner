import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { chaveDeNome } from '../dominio/adiar'
import type { Artigo } from '../dominio/tipos'

const TETO = 6

/** "2,49" e "2.49" são o mesmo preço. Vazio é vazio, não é zero. */
export function lerPreco(t: string): number | null {
  const limpo = t.replace(/[^\d,.-]/g, '').replace(',', '.')
  if (!limpo) return null
  const n = Number(limpo)
  return Number.isFinite(n) ? n : null
}

/**
 * A linha em branco no fundo da lista.
 *
 * Escrever a lista é o trabalho todo, por isso é aqui que se ganha ou se
 * perde tempo. O que esta linha promete:
 *   — Tab passa à quantidade e ao preço, e não fecha a linha a meio;
 *   — Enter fecha a linha e deixa o cursor pronto para a seguinte;
 *   — o que a casa já comprou aparece à medida que se escreve, com a
 *     quantidade e o preço do costume já lá.
 */
export function LinhaNova({ artigos, mostrarPreco, aoAcrescentar }: {
  artigos: Artigo[]
  mostrarPreco: boolean
  aoAcrescentar: (nome: string, quantidade: string | null, preco: number | null) => void
}) {
  const [nome, definirNome] = useState('')
  const [qtd, definirQtd] = useState('')
  const [preco, definirPreco] = useState('')
  const [activa, definirActiva] = useState(-1)
  const caixaNome = useRef<HTMLInputElement>(null)
  const linha = useRef<HTMLDivElement>(null)

  const chave = chaveDeNome(nome)
  const sugestoes = useMemo(() => {
    if (!chave) return []
    return artigos
      .filter(a => a.chave.includes(chave) && a.chave !== chave)
      .slice(0, TETO)
  }, [artigos, chave])

  /** O artigo exactamente igual ao que está escrito: é ele que empresta o que falta. */
  const sabido = useMemo(() => artigos.find(a => a.chave === chave) ?? null, [artigos, chave])

  const limpar = () => { definirNome(''); definirQtd(''); definirPreco(''); definirActiva(-1) }

  const fechar = (a?: Artigo) => {
    const escrito = (a?.nome ?? nome).trim()
    if (!escrito) return
    const memoria = a ?? sabido
    aoAcrescentar(
      escrito,
      qtd.trim() || memoria?.quantidade || null,
      lerPreco(preco) ?? memoria?.preco ?? null,
    )
    limpar()
    caixaNome.current?.focus()
  }

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && sugestoes.length) {
      e.preventDefault(); definirActiva(i => (i + 1) % sugestoes.length); return
    }
    if (e.key === 'ArrowUp' && sugestoes.length) {
      e.preventDefault(); definirActiva(i => (i <= 0 ? sugestoes.length : i) - 1); return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      fechar(activa >= 0 ? sugestoes[activa] : undefined)
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      if (activa >= 0) definirActiva(-1)
      else limpar()
    }
  }

  /** Só fecha a linha quando se sai dela de vez — nunca ao passar para a quantidade. */
  const saiuDaLinha = (e: React.FocusEvent<HTMLDivElement>) => {
    if (linha.current?.contains(e.relatedTarget as Node | null)) return
    definirActiva(-1)
    if (nome.trim()) fechar()
  }

  return (
    <div className="linha-nova" ref={linha} onBlur={saiuDaLinha}>
      <div className="linha linha--compra linha--branco" data-com-preco={mostrarPreco || undefined}>
        <span className="linha-goteira" />
        <span className="linha-corpo">
          <input
            ref={caixaNome}
            className="escrita"
            value={nome}
            onChange={e => { definirNome(e.target.value); definirActiva(-1) }}
            onKeyDown={teclas}
            placeholder="escrever…"
            aria-label="Escrever uma coisa para comprar"
            aria-autocomplete="list"
            aria-expanded={sugestoes.length > 0}
            aria-controls="sugestoes-compra"
            aria-activedescendant={activa >= 0 ? `sugestao-${activa}` : undefined}
            role="combobox"
            maxLength={80}
            autoComplete="off"
          />
        </span>
        <span className="linha-hora">
          <input
            className="escrita escrita--hora"
            value={qtd}
            onChange={e => definirQtd(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fechar() } }}
            placeholder={sabido?.quantidade ?? 'qt.'}
            aria-label={sabido?.quantidade ? `Quantidade — do costume, ${sabido.quantidade}` : 'Quantidade'}
            maxLength={24}
          />
        </span>
        {mostrarPreco && (
          <span className="linha-preco">
            <input
              className="escrita escrita--hora"
              value={preco}
              onChange={e => definirPreco(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fechar() } }}
              placeholder={sabido?.preco != null ? sabido.preco.toFixed(2).replace('.', ',') : '€'}
              inputMode="decimal"
              aria-label="Preço, opcional"
              maxLength={10}
            />
          </span>
        )}
        <span className="linha-carimbo" />
        <span className="linha-accoes" />
      </div>

      {sugestoes.length > 0 && (
        <ul className="sugestoes" id="sugestoes-compra" role="listbox" aria-label="Já comprado nesta casa">
          {sugestoes.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                role="option"
                id={`sugestao-${i}`}
                aria-selected={i === activa}
                className="sugestao"
                data-activa={i === activa || undefined}
                onMouseEnter={() => definirActiva(i)}
                onClick={() => fechar(a)}
              >
                <span className="sugestao-nome">{a.nome}</span>
                <span className="sugestao-costume impresso">
                  {[a.quantidade, a.preco != null ? `${a.preco.toFixed(2).replace('.', ',')} €` : null]
                    .filter(Boolean).join(' · ') || 'sem quantidade guardada'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
