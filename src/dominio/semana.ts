export const DIAS = [
  'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo',
] as const

/** Semana começa à segunda, como em Portugal. */
export function inicioDaSemana(d = new Date()): Date {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const desvio = (dt.getDay() + 6) % 7
  dt.setDate(dt.getDate() - desvio)
  return dt
}

export function diaDaSemana(inicio: Date, i: number): Date {
  const d = new Date(inicio)
  d.setDate(d.getDate() + i)
  return d
}

/** "24/08" — o que se escreve no cabeçalho do dia. */
export function curto(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** "24 – 30 de agosto de 2026", com os dois meses quando a semana os atravessa. */
export function intervalo(inicio: Date): string {
  const fim = diaDaSemana(inicio, 6)
  const mes = new Intl.DateTimeFormat('pt-PT', { month: 'long' })
  const mesmoMes = inicio.getMonth() === fim.getMonth()
  const mesmoAno = inicio.getFullYear() === fim.getFullYear()
  const a = mesmoMes ? `${inicio.getDate()}` : `${inicio.getDate()} de ${mes.format(inicio)}`
  const b = `${fim.getDate()} de ${mes.format(fim)}`
  const ano = mesmoAno ? `${fim.getFullYear()}` : `${inicio.getFullYear()}–${fim.getFullYear()}`
  return `${a} – ${b} de ${ano}`
}

/** Índice de hoje dentro desta semana, ou -1 se a semana mostrada não é a corrente. */
export function indiceDeHoje(inicio: Date): number {
  const hoje = new Date()
  const h = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const dif = Math.round((h.getTime() - inicio.getTime()) / 86_400_000)
  return dif >= 0 && dif <= 6 ? dif : -1
}

/** "2026-08-31" — como as datas viajam para a base de dados e para a cache. */
export function chaveDeData(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const chaveDaSemana = chaveDeData

/** O contrário: de "2026-08-31" para uma data local, sem fuso pelo meio. */
export function dataDeChave(chave: string): Date {
  const [a, m, d] = chave.split('-').map(Number)
  return new Date(a, (m ?? 1) - 1, d ?? 1)
}

export function somarDias(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Quantos dias vão de uma data à outra. Só conta dias, nunca horas. */
export function diasEntre(de: Date, ate: Date): number {
  const a = new Date(de.getFullYear(), de.getMonth(), de.getDate())
  const b = new Date(ate.getFullYear(), ate.getMonth(), ate.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** "Seg 31/08" — como um dia se apresenta quando é preciso escolhê-lo. */
export function diaCurto(d: Date): string {
  return `${DIAS[(d.getDay() + 6) % 7].slice(0, 3)} ${curto(d)}`
}
