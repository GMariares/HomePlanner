/**
 * O dinheiro da casa, em cêntimos inteiros.
 *
 * Nunca em vírgula flutuante: 0,1 + 0,2 não dá 0,3 em binário, e num sítio
 * onde se soma um ano de compras isso deixa de ser curiosidade e passa a ser
 * um erro no total. Entra como texto, vive como inteiro, sai formatado.
 */

const EUROS = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' })
const EUROS_REDONDOS = new Intl.NumberFormat('pt-PT', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

/** "12,50 €". O sinal é do chamador — mas o zero negativo do IEEE não é
 *  sinal nenhum, e "-0,00 €" no ecrã é um erro a fingir de número. */
export const escreverEuros = (cents: number) => EUROS.format(cents === 0 ? 0 : cents / 100)

/** "1 250 €" — para números grandes onde os cêntimos são ruído. */
export const escreverRedondo = (cents: number) => EUROS_REDONDOS.format(Math.round(cents / 100))

/**
 * "12,50" · "12.50" · "1 234,56" · "-12,50" · "1.234,56" → cêntimos.
 * Devolve null para o que não é um número; vazio é vazio, não é zero.
 */
export function lerCents(texto: string): number | null {
  const cru = (texto ?? '').trim()
  if (!cru) return null
  const negativo = /^-/.test(cru) || /\(.*\)/.test(cru)
  let limpo = cru.replace(/[^\d.,]/g, '')
  if (!limpo) return null

  const ultimaVirgula = limpo.lastIndexOf(',')
  const ultimoPonto = limpo.lastIndexOf('.')
  /* O último separador é o decimal — seja ele vírgula (pt) ou ponto (en).
     Tudo o que vem antes são milhares e desaparece. */
  const corte = Math.max(ultimaVirgula, ultimoPonto)
  if (corte === -1) {
    limpo = limpo.replace(/\D/g, '')
    const n = Number(limpo)
    return Number.isFinite(n) ? (negativo ? -1 : 1) * n * 100 : null
  }
  const inteiros = limpo.slice(0, corte).replace(/\D/g, '')
  const decimais = limpo.slice(corte + 1).replace(/\D/g, '')
  /* Três casas depois do último separador não são cêntimos — são milhares:
     "1.234" é mil duzentos e trinta e quatro, não um e vinte e três. */
  if (decimais.length === 3 && limpo.slice(corte, corte + 1) === '.') {
    const n = Number(inteiros + decimais)
    return Number.isFinite(n) ? (negativo ? -1 : 1) * n * 100 : null
  }
  const cents = Number(inteiros || '0') * 100 + Number((decimais + '00').slice(0, 2))
  return Number.isFinite(cents) ? (negativo ? -1 : 1) * cents : null
}

/* ------------------------------------------------------------------ */

export interface MovimentoLeve {
  valor_cents: number
  compromisso_id?: string | null
  natureza?: 'despesa' | 'entrada' | null
  data: string
}

/**
 * O que é entrada e o que é gasto.
 *
 * Um estorno do supermercado é positivo NUMA CATEGORIA DE DESPESA: não é
 * dinheiro que a casa ganhou, é uma compra que se desfez, por isso desconta
 * do envelope em vez de aparecer como rendimento. Entrada é só o que vem de
 * uma categoria de entrada — ou de nenhuma.
 */
export const eEntrada = (m: MovimentoLeve) => m.valor_cents > 0 && m.natureza !== 'despesa'

/** O gasto de um conjunto de movimentos. Positivo = saiu dinheiro. */
export const gastoDe = (ms: MovimentoLeve[]) =>
  -ms.filter(m => !eEntrada(m)).reduce((s, m) => s + m.valor_cents, 0)

/** O que entrou. */
export const entradaDe = (ms: MovimentoLeve[]) =>
  ms.filter(eEntrada).reduce((s, m) => s + m.valor_cents, 0)

/* ------------------------------------------------------------------ */

export type EstadoDoRitmo = 'cedo' | 'folgado' | 'a-tempo' | 'apertado' | 'passou'

export interface Ritmo {
  /** Quanto já saiu do que é variável, em cêntimos. */
  gasto: number
  /** O tecto somado dos envelopes. 0 = ainda não há orçamento. */
  orcamento: number
  /** Onde o ritmo uniforme diria que se devia estar. */
  esperado: number
  /** A folga aceite de cada lado do esperado. */
  tolerancia: number
  dia: number
  dias: number
  estado: EstadoDoRitmo
  /** O que se diz — nunca só uma cor. */
  palavras: string
}

const DIA_SEM_JUIZO = 7

/**
 * O passo do mês.
 *
 * O corredor mede SÓ o que é variável: os compromissos estão fora por
 * construção, senão a renda que cai no dia 8 fazia o mês parecer perdido
 * numa terça-feira. E é um corredor, não uma linha — uma casa a sério
 * compra ao sábado, não um doze-avos por dia.
 */
export function calcularRitmo(gasto: number, orcamento: number, hoje: Date, mes: Date): Ritmo {
  const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()
  const mesmoMes = hoje.getFullYear() === mes.getFullYear() && hoje.getMonth() === mes.getMonth()
  const passou = hoje > new Date(mes.getFullYear(), mes.getMonth() + 1, 0)
  const dia = mesmoMes ? hoje.getDate() : passou ? dias : 0

  const esperado = orcamento === 0 ? 0 : Math.round((orcamento * dia) / dias)
  const tolerancia = Math.round(orcamento * 0.08)

  let estado: EstadoDoRitmo
  let palavras: string
  if (orcamento === 0) {
    estado = 'cedo'
    palavras = 'sem orçamento posto'
  } else if (gasto > orcamento) {
    estado = 'passou'
    palavras = 'passou o orçamento do mês'
  } else if (dia > 0 && dia < DIA_SEM_JUIZO) {
    /* Nos primeiros dias não há sinal nenhum: uma compra grande no dia 2
       não quer dizer nada, e um alarme que se engana todos os meses
       deixa de ser lido. */
    estado = 'cedo'
    palavras = 'ainda é cedo para dizer'
  } else if (gasto > esperado + tolerancia) {
    estado = 'apertado'
    palavras = 'acima do ritmo'
  } else if (gasto < esperado - tolerancia) {
    estado = 'folgado'
    palavras = 'abaixo do ritmo'
  } else {
    estado = 'a-tempo'
    palavras = 'a bom ritmo'
  }

  return { gasto, orcamento, esperado, tolerancia, dia, dias, estado, palavras }
}

/**
 * A pressão de um envelope: 1 = no tecto. É por aqui que se ordenam.
 *
 * Sem tecto não há pressão nenhuma — só falta pôr um. Fica abaixo de
 * qualquer envelope com tecto, porque um que rebentou é notícia e um sem
 * tecto é só uma definição por fazer.
 */
export const pressaoDe = (gasto: number, limite: number | null) => {
  if (limite && limite > 0) return gasto / limite
  return gasto > 0 ? -0.5 : -1
}
