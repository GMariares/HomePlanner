import { useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import type { Categoria, Movimento } from '../dominio/financas'
import { lerCents } from '../dominio/dinheiro'
import { regraPara, type Fornecedor } from '../dominio/fornecedores'
import { chaveDeNome } from '../dominio/adiar'
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
const hojeIso = () => {
  const h = new Date()
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`
}

export function RegistoRapido({ categorias, fornecedores = [], aoRegistar, aoGuardarFornecedor }: {
  categorias: Categoria[]
  fornecedores?: Fornecedor[]
  aoRegistar: (m: Partial<Movimento>) => void | Promise<void>
  aoGuardarFornecedor?: (f: Partial<Fornecedor>) => void
}) {
  const [valor, definirValor] = useState('')
  const [descricao, definirDescricao] = useState('')
  const [fornecedor, definirFornecedor] = useState('')
  const [data, definirData] = useState(hojeIso)
  const [categoria, definirCategoria] = useState<string>('')
  const [escolhidaAMao, definirEscolhidaAMao] = useState(false)
  const [entrada, definirEntrada] = useState(false)
  const campoValor = useRef<HTMLInputElement>(null)

  /* "Auchan" escrito no fornecedor escolhe a categoria sozinho — a regra
     que a casa já ensinou. Uma escolha à mão ganha sempre à regra. */
  const regra = useMemo(
    () => (fornecedor.trim() ? regraPara(fornecedor, fornecedores) : null),
    [fornecedor, fornecedores],
  )
  const categoriaEfectiva = escolhidaAMao ? categoria : (regra?.categoria_id ?? categoria)
  const regraNova = Boolean(
    aoGuardarFornecedor && fornecedor.trim().length >= 2 && categoriaEfectiva && !regra,
  )

  const vivas = categorias.filter(c => !c.arquivada)
  const raizes = vivas.filter(c => c.natureza === (entrada ? 'entrada' : 'despesa') && !c.mae_id)
  /* Escolhida uma categoria com partes, as partes aparecem por baixo:
     quem quer só "Casa" fica por ali; quem quer "Renda" toca mais uma vez. */
  const escolhida = vivas.find(c => c.id === categoriaEfectiva)
  const raizEscolhida = escolhida ? (escolhida.mae_id ?? escolhida.id) : null
  const filhas = raizEscolhida ? vivas.filter(c => c.mae_id === raizEscolhida) : []
  const cents = lerCents(valor)
  const podeGuardar = cents !== null && cents !== 0

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    if (cents === null || cents === 0) return
    await aoRegistar({
      data: data || hojeIso(),
      /* O sinal é do sentido, não do que se escreveu: quem regista um gasto
         escreve "12,50" e não "-12,50". */
      valor_cents: entrada ? Math.abs(cents) : -Math.abs(cents),
      descricao: descricao.trim() || fornecedor.trim(),
      fornecedor: regra?.nome ?? (fornecedor.trim() || null),
      categoria_id: categoriaEfectiva || null,
    })
    definirValor(''); definirDescricao(''); definirFornecedor('')
    definirEscolhidaAMao(false)
    campoValor.current?.focus()
  }

  const fixarRegra = () => {
    if (!aoGuardarFornecedor || !categoriaEfectiva) return
    aoGuardarFornecedor({
      chave: chaveDeNome(fornecedor).replace(/\s+/g, ' ').trim(),
      nome: fornecedor.trim(),
      categoria_id: categoriaEfectiva,
    })
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
        <input
          className="campo-escrita registo-fornecedor"
          value={fornecedor}
          onChange={e => definirFornecedor(e.target.value)}
          placeholder="onde — Auchan, EDP…"
          aria-label="Fornecedor"
          maxLength={40}
          list="fornecedores-conhecidos"
        />
        <datalist id="fornecedores-conhecidos">
          {fornecedores.map(f => <option key={f.id} value={f.nome || f.chave} />)}
        </datalist>
        <input
          type="date"
          className="campo-escrita registo-data"
          value={data}
          onChange={e => definirData(e.target.value)}
          aria-label="Em que dia aconteceu"
          max={hojeIso()}
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
          onClick={() => { definirEntrada(v => !v); definirCategoria(''); definirEscolhidaAMao(false) }}
        >
          {entrada ? 'é uma entrada' : 'é um gasto'}
        </button>
        {regra && !escolhidaAMao && (
          <span className="registo-regra" role="status">
            {regra.nome || regra.chave} → já sabe a categoria
          </span>
        )}
        {regraNova && (
          <button type="button" className="botao-texto registo-fixar" onClick={fixarRegra}>
            lembrar: {fornecedor.trim()} → {vivas.find(c => c.id === categoriaEfectiva)?.nome}
          </button>
        )}

        <div className="registo-arvore">
          <div className="chips registo-cats">
            {raizes.map(c => {
              const Icone = iconeDeCategoria(c.icone)
              const activa = raizEscolhida === c.id || categoriaEfectiva === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  className="chip com-cor registo-cat"
                  style={{ '--cor': c.cor } as CSSProperties}
                  data-activa={activa || undefined}
                  aria-pressed={activa}
                  onClick={() => { definirCategoria(activa ? '' : c.id); definirEscolhidaAMao(true) }}
                >
                  <Icone lado={15} />
                  {c.nome}
                </button>
              )
            })}
          </div>
          {filhas.length > 0 && (
            <div className="chips registo-cats registo-cats--finas">
              {filhas.map(c => {
                const activa = categoriaEfectiva === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="chip com-cor registo-cat registo-cat--fina"
                    style={{ '--cor': c.cor } as CSSProperties}
                    data-activa={activa || undefined}
                    aria-pressed={activa}
                    onClick={() => { definirCategoria(activa ? raizEscolhida ?? '' : c.id); definirEscolhidaAMao(true) }}
                  >
                    {c.nome}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
