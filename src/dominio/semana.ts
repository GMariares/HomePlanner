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

export function chaveDaSemana(inicio: Date): string {
  return `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}-${String(inicio.getDate()).padStart(2, '0')}`
}
