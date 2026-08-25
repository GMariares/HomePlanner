import { useRef, useState, type CSSProperties, type FormEvent } from 'react'
import type { Categoria, Movimento } from '../dominio/financas'
import { lerCents } from '../dominio/dinheiro'
import { iconeDeCategoria } from './IconesFinancas'
import { IMais } from './Icones'

/**
 * Registar um gasto.
 *
 * É aqui que a ferramenta se ganha ou se perde: se escrever um gasto for
 * mais lento do que não o escrever, o registo apodrece e o resto não serve
 * de nada. Uma linha: quanto, o quê, em que categoria. Tudo o resto tem
 * uma resposta razoável por omissão e pode corrigir-se depois.
 */
export function RegistoRapido({ categorias, aoRegistar }: {
  categorias: Categoria[]
  aoRegistar: (m: Partial<Movimento>) => void | Promise<void>
}) {
  const [valor, definirValor] = useState('')
  const [descricao, definirDescricao] = useState('')
  const [categoria, definirCategoria] = useState<string>('')
  const [entrada, definirEntrada] = useState(false)
  const campoValor = useRef<HTMLInputElement>(null)

  const despesas = categorias.filter(c => c.natureza === 'despesa' && !c.arquivada)
  const entradas = categorias.filter(c => c.natureza === 'entrada' && !c.arquivada)
  const lista = entrada ? entradas : despesas
  const cents = lerCents(valor)
  const podeGuardar = cents !== null && cents !== 0

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    if (cents === null || cents === 0) return
    const hoje = new Date()
    await aoRegistar({
      data: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`,
      /* O sinal é do sentido, não do que se escreveu: quem regista um gasto
         escreve "12,50" e não "-12,50". */
      valor_cents: entrada ? Math.abs(cents) : -Math.abs(cents),
      descricao: descricao.trim(),
      categoria_id: categoria || null,
    })
    definirValor(''); definirDescricao('')
    campoValor.current?.focus()
  }

  return (
    <form className="registo" onSubmit={guardar}>
      <div className="registo-linha">
        <span className="registo-sinal" aria-hidden="true">{entrada ? '+' : '−'}</span>
        <input
          ref={campoValor}
          className="campo-escrita registo-valor"
          value={valor}
          onChange={e => definirValor(e.target.value)}
          placeholder="0,00"
          inputMode="decimal"
          aria-label={entrada ? 'Quanto entrou' : 'Quanto se gastou'}
          maxLength={12}
        />
        <input
          className="campo-escrita registo-descricao"
          value={descricao}
          onChange={e => definirDescricao(e.target.value)}
          placeholder={entrada ? 'de onde veio…' : 'em quê…'}
          aria-label="Descrição"
          maxLength={80}
        />
        <button type="submit" className="pilula registo-guardar" disabled={!podeGuardar}>
          <IMais lado={18} />
          <span className="registo-guardar-texto">Registar</span>
        </button>
      </div>

      <div className="registo-baixo">
        <button
          type="button"
          className="botao-texto"
          aria-pressed={entrada}
          onClick={() => { definirEntrada(v => !v); definirCategoria('') }}
        >
          {entrada ? 'é uma entrada' : 'é um gasto'}
        </button>

        <div className="chips registo-cats">
          {lista.map(c => {
            const Icone = iconeDeCategoria(c.icone)
            const activa = categoria === c.id
            return (
              <button
                key={c.id}
                type="button"
                className="chip com-cor registo-cat"
                style={{ '--cor': c.cor } as CSSProperties}
                data-activa={activa || undefined}
                aria-pressed={activa}
                onClick={() => definirCategoria(activa ? '' : c.id)}
              >
                <Icone lado={15} />
                {c.nome}
              </button>
            )
          })}
        </div>
      </div>
    </form>
  )
}
