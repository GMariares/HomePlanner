import { chaveDeNome } from './adiar'

export interface Fornecedor {
  id: string
  chave: string
  nome: string
  categoria_id: string | null
}

/**
 * "Auchan é Mercado" diz-se uma vez.
 *
 * A chave é um pedaço de texto e casa por conter: "auchan" apanha
 * "AUCHAN MATOSINHOS" hoje e "AUCHAN GAIA" para o mês, porque os bancos
 * nunca escrevem o mesmo nome duas vezes. Quando mais do que uma chave
 * casa, ganha a mais comprida — "meu super cafetaria" antes de "meu super".
 */
export function regraPara(descricao: string, regras: Fornecedor[]): Fornecedor | null {
  const alvo = ` ${chaveDeNome(descricao).replace(/\s+/g, ' ')} `
  let melhor: Fornecedor | null = null
  for (const r of regras) {
    const chave = chaveDeNome(r.chave).replace(/\s+/g, ' ')
    if (chave.length < 2) continue
    if (!alvo.includes(chave)) continue
    if (!melhor || chave.length > chaveDeNome(melhor.chave).length) melhor = r
  }
  return melhor
}

/**
 * Uma chave proposta a partir do que o banco escreveu: minúsculas, sem
 * acentos, sem os números que mudam de linha para linha ("Trf Mbway
 * 914XXX709" → "trf mbway"), aparada. É um palpite editável, não uma decisão.
 */
export function proporChave(descricao: string): string {
  return chaveDeNome(descricao)
    .replace(/[0-9x*#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
    .trim()
}
