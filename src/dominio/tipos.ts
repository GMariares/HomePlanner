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
