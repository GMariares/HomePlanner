/**
 * iCalendar (RFC 5545) — a agenda da casa como um calendário subscrito.
 *
 * O formato é picuinhas e não perdoa: linhas terminadas em CRLF, dobradas
 * aos 75 octetos (octetos, não letras — "ã" ocupa dois), e vírgulas, pontos
 * e vírgulas e barras escapadas dentro do texto. Um ficheiro quase certo é
 * um ficheiro que o telemóvel recusa.
 */

export interface LinhaDoCalendario {
  id: string
  texto: string
  genero: string
  autor: string | null
  inicio_data: string
  fim_efectivo: string | null
  hora: string | null
  hora_fim: string | null
}

const NOMES: Record<string, string> = { pai: 'Pai', mae: 'Mãe', filha: 'Filha', casa: '' }

const escapar = (s: string) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

/** Dobra aos 75 octetos, continuando com um espaço — e nunca a meio de um carácter. */
export function dobrar(linha: string): string[] {
  const bytes = Buffer.from(linha, 'utf8')
  if (bytes.length <= 75) return [linha]
  const partes: string[] = []
  let i = 0
  let limite = 75
  while (i < bytes.length) {
    let fim = Math.min(i + limite, bytes.length)
    // recuar até ao princípio de um carácter UTF-8
    while (fim > i && fim < bytes.length && (bytes[fim] & 0xc0) === 0x80) fim--
    partes.push(bytes.subarray(i, fim).toString('utf8'))
    i = fim
    limite = 74 // as seguintes levam um espaço à frente
  }
  return partes.map((p, n) => (n === 0 ? p : ' ' + p))
}

const carimbo = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}` +
  `T${String(d.getUTCHours()).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(2, '0')}${String(d.getUTCSeconds()).padStart(2, '0')}Z`

const soData = (iso: string) => iso.slice(0, 10).replace(/-/g, '')

/** "12:00" → "120000"; o que não for uma hora inteira não é hora nenhuma. */
function comoHora(h: string | null): string | null {
  if (!h) return null
  const m = /^(\d{1,2}):(\d{2})$/.exec(h.trim())
  if (!m) return null
  const hh = Number(m[1]); const mm = Number(m[2])
  if (hh > 23 || mm > 59) return null
  return `${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`
}

const diaSeguinte = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

/* Portugal continental. Sem isto os compromissos aterram na hora errada em
   quem viaja, e o telemóvel não tem como saber a que fuso "12:00" pertence. */
const FUSO = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Lisbon',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0000',
  'TZOFFSETTO:+0100',
  'TZNAME:WEST',
  'DTSTART:19700329T010000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0000',
  'TZNAME:WET',
  'DTSTART:19701025T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

export function construirIcs(
  linhas: LinhaDoCalendario[],
  nomeDaCasa: string,
  agora = new Date(),
): string {
  const out: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HomePlanner//A casa//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(nomeDaCasa || 'A nossa casa')}`,
    'X-WR-TIMEZONE:Europe/Lisbon',
    // sugestões de actualização ao cliente; cada um obedece como quer
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
    ...FUSO,
  ]

  for (const l of linhas) {
    if (!l.inicio_data) continue
    const inicio = comoHora(l.hora)
    const fim = comoHora(l.hora_fim)
    const dataFim = l.fim_efectivo ?? l.inicio_data

    out.push('BEGIN:VEVENT')
    /* O mesmo id em cada leitura: assim o telemóvel actualiza o que já
       tinha em vez de acumular cópias do mesmo compromisso. */
    out.push(`UID:${l.id}@homeplanner`)
    out.push(`DTSTAMP:${carimbo(agora)}`)

    if (inicio) {
      out.push(`DTSTART;TZID=Europe/Lisbon:${soData(l.inicio_data)}T${inicio}`)
      if (fim) out.push(`DTEND;TZID=Europe/Lisbon:${soData(dataFim)}T${fim}`)
      /* Sem hora de fim não se inventa uma: pela norma, um evento sem DTEND
         acaba onde começa. Melhor um instante verdadeiro do que uma hora
         arredondada que ninguém escreveu. */
    } else {
      // dia inteiro: o fim é exclusivo, por isso vai o dia seguinte
      out.push(`DTSTART;VALUE=DATE:${soData(l.inicio_data)}`)
      out.push(`DTEND;VALUE=DATE:${diaSeguinte(dataFim)}`)
    }

    const quem = NOMES[l.autor ?? ''] ?? ''
    const titulo = quem ? `${quem} · ${l.texto || 'Sem título'}` : (l.texto || 'Sem título')
    out.push(`SUMMARY:${escapar(titulo)}`)
    out.push(`CATEGORIES:${l.genero === 'tarefa' ? 'Tarefa' : 'Agenda'}`)
    out.push('TRANSP:TRANSPARENT')
    out.push('END:VEVENT')
  }

  out.push('END:VCALENDAR')
  return out.flatMap(dobrar).join('\r\n') + '\r\n'
}
