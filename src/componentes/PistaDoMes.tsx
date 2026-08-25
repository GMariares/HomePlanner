import type { Ritmo } from '../dominio/dinheiro'
import { escreverEuros } from '../dominio/dinheiro'

/**
 * O passo do mês.
 *
 * Uma pista do dia 1 ao último dia. Por cima corre o corredor — onde um
 * gasto uniforme diria que se devia estar, com a folga de cada lado — e
 * dentro dele a barra do que já saiu. O marcador é hoje.
 *
 * O corredor é um corredor e não uma linha de propósito: uma casa compra
 * ao sábado, não um trinta-avos por dia. E cobre só o que é variável, que
 * é a única maneira de a renda do dia 8 não fazer o mês parecer perdido
 * numa terça-feira.
 */
export function PistaDoMes({ ritmo }: { ritmo: Ritmo }) {
  const { gasto, orcamento, esperado, tolerancia, dia, dias, estado, palavras } = ritmo
  const semOrcamento = orcamento === 0

  const pct = (v: number) => (orcamento === 0 ? 0 : Math.min(100, Math.max(0, (v / orcamento) * 100)))
  const inicioCorredor = pct(esperado - tolerancia)
  const larguraCorredor = Math.max(pct(esperado + tolerancia) - inicioCorredor, 0.5)
  const gastoPct = pct(gasto)
  const excedeu = gasto > orcamento

  return (
    <section className="pista" aria-labelledby="pista-titulo" data-estado={estado}>
      <header className="pista-cabeca">
        <h3 id="pista-titulo" className="pista-titulo">
          {semOrcamento ? 'Gasto este mês' : 'O passo do mês'}
        </h3>
        <p className="pista-dia">
          {dia === 0 ? 'ainda não começou' : `dia ${dia} de ${dias}`}
        </p>
      </header>

      <p className="pista-numero">
        <strong className="pista-gasto">{escreverEuros(gasto)}</strong>
        {!semOrcamento && (
          <span className="pista-de">de {escreverEuros(orcamento)}</span>
        )}
      </p>

      {/* A barra é decoração de uma verdade que já está escrita acima e
          abaixo: quem não distingue as cores lê na mesma. */}
      <div className="pista-barra" aria-hidden="true">
        {!semOrcamento && dia > 0 && (
          <span
            className="pista-corredor"
            style={{ insetInlineStart: `${inicioCorredor}%`, width: `${larguraCorredor}%` }}
          />
        )}
        <span className="pista-gasta" style={{ width: `${gastoPct}%` }} data-excedeu={excedeu || undefined} />
      </div>

      <p className="pista-leitura">
        <span className="pista-selo" data-estado={estado}>{palavras}</span>
        {!semOrcamento && dia > 0 && estado !== 'cedo' && (
          <span className="pista-nota">
            ao ritmo de hoje seriam {escreverEuros(esperado)}
          </span>
        )}
        {semOrcamento && (
          <span className="pista-nota">ponha um tecto nas categorias e esta pista ganha sentido</span>
        )}
      </p>
    </section>
  )
}
