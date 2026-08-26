import type { ReactNode } from 'react'
import type { Resumo as Dados } from '../dominio/financas'
import { escreverEuros } from '../dominio/dinheiro'
import { useContagem } from '../dominio/animar'

/**
 * Uma das três colunas: o real, o previsto e a diferença por extenso.
 *
 * A diferença nunca é só uma cor. "+120,00 € acima do previsto" lê-se
 * igual a preto e branco, e é a frase que decide se o número é boa ou má
 * notícia — porque gastar acima e receber acima não querem dizer o mesmo.
 *
 * E sem previsão não há juízo nenhum. O passo do mês já se cala quando não
 * há orçamento posto; estes números calam-se pela mesma razão. Julgar a
 * despesa contra os compromissos sozinhos dizia a uma casa acabada de
 * abrir que estava mil euros acima do previsto, a vermelho, no primeiro
 * ecrã que via.
 */
function Numero({ nome, real, previsto, temPrevisao, falta, melhorAcima }: {
  nome: string
  real: number
  previsto: number
  temPrevisao: boolean
  /** O que falta pôr para este número ganhar um previsto. */
  falta: string
  melhorAcima: boolean
}) {
  const mostrado = useContagem(real)
  const diferenca = real - previsto
  const tom = !temPrevisao || diferenca === 0 ? 'neutro'
    : (diferenca > 0) === melhorAcima ? 'bom' : 'mau'

  return (
    <div className="balanco-bloco">
      <p className="balanco-nome">{nome}</p>
      <p className="balanco-real">{escreverEuros(mostrado)}</p>
      <p className="balanco-previsto">
        {temPrevisao ? <>previsto {escreverEuros(previsto)}</> : falta}
      </p>
      {/* Sem previsto não há diferença: em vez de a repetir três vezes
          por extenso, a linha simplesmente não existe. */}
      {temPrevisao && <p className="balanco-diferenca" data-tom={tom}>
        {diferenca === 0 ? 'certo com o previsto'
          : <>
              {diferenca > 0 ? '+' : '−'}{escreverEuros(Math.abs(diferenca))}
              <span className="balanco-palavra">{diferenca > 0 ? 'acima do previsto' : 'abaixo do previsto'}</span>
            </>}
      </p>}
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
  /* O previsto da despesa só existe com tectos postos: os compromissos
     sozinhos não são um orçamento, são uma parte dele. */
  const temSaida = r.temTectos
  const temEntrada = r.previstoEntrada > 0
  const convite =
    !temSaida && !temEntrada ? 'Ponha um tecto nas categorias e uma previsão nas entradas: as diferenças aparecem aqui.'
      : !temSaida ? 'Ponha um tecto nas categorias e a diferença da despesa aparece aqui.'
      : !temEntrada ? 'Ponha uma previsão nas entradas e a diferença aparece aqui.'
      : 'Previsto da despesa: os tectos dos envelopes mais os compromissos do mês.'

  return (
    <section className="modulo balanco" aria-labelledby="balanco-titulo">
      <header className="dia-cabeca dia-cabeca--lista">
        <h3 id="balanco-titulo" className="dia-nome">O mês, em três números</h3>
        <span className="dia-data">real ao lado do previsto</span>
        {accao && <span className="balanco-accao">{accao}</span>}
      </header>

      <div className="balanco-linha">
        <Numero nome="Entrou" real={r.entrou} previsto={r.previstoEntrada}
          temPrevisao={temEntrada} falta="sem previsão posta" melhorAcima />
        <Numero nome="Saiu" real={r.saiu} previsto={r.previstoSaida}
          temPrevisao={temSaida} falta="sem tecto posto" melhorAcima={false} />
        <Numero
          nome={r.sobra < 0 ? 'Falta' : 'Sobra'}
          real={r.sobra}
          previsto={r.sobraPrevista}
          /* A sobra prevista precisa dos dois lados: com um só, a conta
             sai de um número inventado. */
          temPrevisao={temSaida && temEntrada}
          falta="sem previsão completa"
          melhorAcima
        />
      </div>

      <p className="balanco-nota">
        {convite}
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
