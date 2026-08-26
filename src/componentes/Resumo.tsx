import type { ReactNode } from 'react'
import type { Resumo as Dados } from '../dominio/financas'
import { escreverEuros } from '../dominio/dinheiro'

/**
 * Uma das três colunas: o real, o previsto e a diferença por extenso.
 *
 * A diferença nunca é só uma cor. "+120,00 € acima do previsto" lê-se
 * igual a preto e branco, e é a frase que decide se o número é boa ou má
 * notícia — porque gastar acima e receber acima não querem dizer o mesmo.
 */
function Numero({ nome, real, previsto, melhorAcima }: {
  nome: string
  real: number
  previsto: number
  melhorAcima: boolean
}) {
  const diferenca = real - previsto
  const semPrevisao = previsto === 0
  const tom = semPrevisao || diferenca === 0 ? 'neutro'
    : (diferenca > 0) === melhorAcima ? 'bom' : 'mau'

  return (
    <div className="balanco-bloco">
      <p className="balanco-nome">{nome}</p>
      <p className="balanco-real">{escreverEuros(real)}</p>
      <p className="balanco-previsto">
        {semPrevisao ? 'sem previsão posta' : <>previsto {escreverEuros(previsto)}</>}
      </p>
      <p className="balanco-diferenca" data-tom={tom}>
        {semPrevisao ? '—'
          : diferenca === 0 ? 'certo com o previsto'
          : <>
              {diferenca > 0 ? '+' : '−'}{escreverEuros(Math.abs(diferenca))}
              <span className="balanco-palavra">{diferenca > 0 ? 'acima do previsto' : 'abaixo do previsto'}</span>
            </>}
      </p>
    </div>
  )
}

/**
 * O mês em três números.
 *
 * O que entrou, o que saiu, e o que sobra — cada um com o previsto ao lado
 * e a diferença dita. É a primeira coisa da página porque é a primeira
 * pergunta de quem a abre: como está o mês?
 *
 * "Saiu" é tudo o que saiu, compromissos incluídos: é o que a conta
 * bancária viu. As transferências entre contas próprias não estão em
 * número nenhum destes — mudaram de bolso, não mudaram de dono.
 */
export function Balanco({ r, accao }: { r: Dados; accao?: ReactNode }) {
  const semPrevisao = r.previstoEntrada === 0 && r.previstoSaida === 0

  return (
    <section className="modulo balanco" aria-labelledby="balanco-titulo">
      <header className="dia-cabeca dia-cabeca--lista">
        <h3 id="balanco-titulo" className="dia-nome">O mês, em três números</h3>
        <span className="dia-data">real ao lado do previsto</span>
        {accao && <span className="balanco-accao">{accao}</span>}
      </header>

      <div className="balanco-linha">
        <Numero nome="Entrou" real={r.entrou} previsto={r.previstoEntrada} melhorAcima />
        <Numero nome="Saiu" real={r.saiu} previsto={r.previstoSaida} melhorAcima={false} />
        <Numero
          nome={r.sobra < 0 ? 'Falta' : 'Sobra'}
          real={r.sobra}
          previsto={r.sobraPrevista}
          melhorAcima
        />
      </div>

      <p className="balanco-nota">
        {semPrevisao
          ? 'Ponha um tecto nas categorias e uma previsão nas entradas: a diferença aparece aqui.'
          : 'Previsto da despesa: os tectos dos envelopes mais os compromissos do mês.'}
        {r.porAlocar > 0 && (
          <span className="balanco-aviso">
            {r.porAlocar === 1 ? '1 movimento por alocar' : `${r.porAlocar} movimentos por alocar`} — ainda podem mudar estes números
          </span>
        )}
        {r.transferencias > 0 && (
          <span>
            {r.transferencias === 1
              ? '1 transferência entre contas ficou de fora'
              : `${r.transferencias} transferências entre contas ficaram de fora`}
          </span>
        )}
      </p>
    </section>
  )
}
