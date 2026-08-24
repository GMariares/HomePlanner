/** Quem escreveu. Cada membro tem a sua caneta — a tinta é a atribuição. */
export type Autor = 'pai' | 'mae' | 'filha' | 'casa'

/** O que está escrito na linha. */
export type Genero = 'evento' | 'refeicao' | 'tarefa'

export type Refeicao = 'almoco' | 'jantar'

/** Uma entrada ocupa exactamente uma pauta. */
export interface Entrada {
  id: string
  /** 0 = segunda … 6 = domingo. `null` = sem data, vive em "Esta semana". */
  dia: number | null
  genero: Genero
  autor: Autor | null
  texto: string
  /** "08:30" — sempre em numerais tabulares, alinhada à direita. */
  hora: string | null
  refeicao?: Refeicao
  /** Tarefa carimbada. */
  feita?: boolean
  /** Compromisso que atravessa vários dias, como se escreve numa agenda: em cada dia. */
  extensao?: 'inicio' | 'meio' | 'fim'
  /** Riscada porque foi movida — a agenda guarda o que aconteceu. */
  riscada?: boolean
  movidaPara?: number | null
}

export const AUTORES: Record<Autor, { etiqueta: string; nome: string; tinta: string }> = {
  pai: { etiqueta: 'Pai', nome: 'Pai', tinta: 'var(--pai)' },
  mae: { etiqueta: 'Mãe', nome: 'Mãe', tinta: 'var(--mae)' },
  filha: { etiqueta: 'Filha', nome: 'Filha', tinta: 'var(--filha)' },
  casa: { etiqueta: 'Todos', nome: 'Todos', tinta: 'var(--casa)' },
}

export const tintaDe = (autor: Autor | null) => (autor ? AUTORES[autor].tinta : 'var(--casa)')

/** Uma casa. Tudo o que está escrito pertence-lhe a ela, não a uma pessoa. */
export interface Casa {
  id: string
  nome: string
  codigo: string
}

export interface Membro {
  id: string
  casa_id: string
  utilizador_id: string
  papel: Autor
}

/** Como uma entrada vive na base de dados. */
export interface EntradaDb {
  id: string
  casa_id: string
  semana: string
  dia: number | null
  genero: Genero
  autor: Autor | null
  texto: string
  hora: string | null
  refeicao: Refeicao | null
  feita: boolean
  extensao: 'inicio' | 'meio' | 'fim' | null
  riscada: boolean
  movida_para: number | null
}

export const daBaseDeDados = (l: EntradaDb): Entrada => ({
  id: l.id,
  dia: l.dia,
  genero: l.genero,
  autor: l.autor,
  texto: l.texto,
  hora: l.hora,
  refeicao: l.refeicao ?? undefined,
  feita: l.feita,
  extensao: l.extensao ?? undefined,
  riscada: l.riscada || undefined,
  movidaPara: l.movida_para,
})

export const paraBaseDeDados = (e: Partial<Entrada>): Record<string, unknown> => {
  const l: Record<string, unknown> = {}
  if ('dia' in e) l.dia = e.dia
  if ('genero' in e) l.genero = e.genero
  if ('autor' in e) l.autor = e.autor ?? null
  if ('texto' in e) l.texto = e.texto
  if ('hora' in e) l.hora = e.hora ?? null
  if ('refeicao' in e) l.refeicao = e.refeicao ?? null
  if ('feita' in e) l.feita = e.feita ?? false
  if ('extensao' in e) l.extensao = e.extensao ?? null
  if ('riscada' in e) l.riscada = e.riscada ?? false
  if ('movidaPara' in e) l.movida_para = e.movidaPara ?? null
  return l
}
