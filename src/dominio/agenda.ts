import type { Entrada } from './tipos'
import { dataDeChave, diaDaSemana, diasEntre } from './semana'
import { parteDoDia, type Parte } from '../componentes/Periodo'

/** Uma entrada vista de um dia: que parte do período este dia mostra. */
export interface ComParte {
  entrada: Entrada
  parte: Parte
  dataDoInicio: Date
  /** 0 = segunda … 6 = domingo, dentro da semana que está aberta. */
  dia: number
}

const ORDEM = { evento: 0, tarefa: 1, refeicao: 2 } as const

/** A hora pela qual uma linha se ordena num dia: só quem começa tem hora. */
const horaDeOrdem = (c: ComParte) =>
  c.parte === 'unico' || c.parte === 'inicio' ? c.entrada.hora : null

export function ordenarDoDia(a: ComParte, b: ComParte) {
  const g = ORDEM[a.entrada.genero] - ORDEM[b.entrada.genero]
  if (g !== 0) return g
  const ha = horaDeOrdem(a)
  const hb = horaDeOrdem(b)
  if (ha && hb) return ha.localeCompare(hb)
  return ha ? -1 : hb ? 1 : 0
}

/**
 * A semana por dias.
 *
 * Uma entrada com período ocupa todos os dias entre o princípio e o fim, e é
 * uma linha só na base de dados: aqui repete-se por dia, com a parte deduzida.
 *
 * Vive no domínio e não numa página de propósito. Enquanto a semana e o
 * início contavam os dias cada um à sua maneira, discordaram: o início ficou
 * a comparar `dia === hoje`, que ignora períodos e ainda casa por acaso com
 * linhas de outras semanas. Quem responde "o que há neste dia" é esta função,
 * e é a mesma para toda a aplicação.
 */
export function porDiaDaSemana(entradas: Entrada[], inicio: Date): Record<number, ComParte[]> {
  const mapa: Record<number, ComParte[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }

  for (const e of entradas) {
    if (e.dia === null) continue

    /* Onde começa: a data que a base de dados gerou. Uma entrada lida nesta
       semana pode ter começado na anterior, e é `inicio_data` que o diz.
       Sem a migração corrida, cai-se no dia dentro da semana mostrada. */
    const dataDoInicio = e.inicioData ? dataDeChave(e.inicioData) : diaDaSemana(inicio, e.dia)
    const fim = e.fimData ? dataDeChave(e.fimData) : dataDoInicio

    for (let i = 0; i <= 6; i++) {
      const data = diaDaSemana(inicio, i)
      if (diasEntre(dataDoInicio, data) < 0 || diasEntre(data, fim) < 0) continue
      mapa[i].push({ entrada: e, parte: parteDoDia(e, dataDoInicio, data), dataDoInicio, dia: i })
    }
  }

  for (const k of Object.keys(mapa)) mapa[+k].sort(ordenarDoDia)
  return mapa
}

/**
 * O que ainda está para vir, a partir de hoje: primeiro o que é de hoje,
 * depois os dias seguintes. É isto que um cartão de início deve dizer —
 * "não há nada" quando há uma consulta na sexta é uma mentira.
 */
export function daquiParaAFrente(
  entradas: Entrada[],
  inicio: Date,
  hoje: number,
  quantos = 4,
): ComParte[] {
  const mapa = porDiaDaSemana(entradas, inicio)
  const desde = hoje >= 0 ? hoje : 0
  const fila: ComParte[] = []
  const jaEsta = new Set<string>()

  for (let i = desde; i <= 6 && fila.length < quantos; i++) {
    for (const c of mapa[i]) {
      if (c.entrada.riscada || c.entrada.genero === 'refeicao') continue

      /* Uma entrada entra uma vez. Sem isto, uma viagem de quatro dias
         ocupava as quatro linhas do cartão e empurrava para fora a consulta
         de sexta — que era, essa sim, a novidade. */
      if (jaEsta.has(c.entrada.id)) continue

      /* Hoje mostra-se tudo o que ocupa hoje, viagens a meio incluídas: é
         contexto do dia. Dos dias seguintes só interessa o que COMEÇA —
         que o pai continua fora já se percebeu na linha de hoje. */
      if (i !== desde && c.parte !== 'unico' && c.parte !== 'inicio') continue

      jaEsta.add(c.entrada.id)
      fila.push(c)
      if (fila.length >= quantos) break
    }
  }
  return fila
}
