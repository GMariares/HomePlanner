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
  /** "08:30" — a que horas começa. Sempre tabular, encostada à direita. */
  hora: string | null
  /** "12:00" — a que horas acaba. Nulo = não tem fim marcado. */
  horaFim?: string | null
  /** "2026-09-03" — o último dia, quando o compromisso passa da meia-noite. */
  fimData?: string | null
  /**
   * "2026-08-31" — a data real em que começa, gerada pela base de dados a
   * partir da semana e do dia. Uma entrada lida numa semana pode ter começado
   * na anterior, e sem isto não havia como saber.
   */
  inicioData?: string | null
  refeicao?: Refeicao
  /** Tarefa carimbada. */
  feita?: boolean
  /**
   * Onde este dia cai dentro do período — deduzido do intervalo ao desenhar
   * a semana, nunca guardado. Linhas antigas ainda o trazem da base de dados;
   * lêem-se na mesma.
   */
  extensao?: 'inicio' | 'meio' | 'fim'
  /** Riscada porque foi movida — a agenda guarda o que aconteceu. */
  riscada?: boolean
  movidaPara?: number | null
  /** Se este jantar veio do livro dos pratos. */
  pratoId?: string | null
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
  /** A lista mostra preços? É uma decisão da casa, não do aparelho. */
  mostrar_precos: boolean
  /**
   * O endereço secreto do calendário subscrito, ou nulo se a casa não
   * publica nada. Quem o tiver vê a agenda: trocá-lo corta o acesso.
   */
  calendario_token?: string | null
}

export interface Membro {
  id: string
  casa_id: string
  utilizador_id: string
  papel: Autor
}

/** Um prato do livro da casa. */
export interface Prato {
  id: string
  nome: string
  ingredientes: Ingrediente[]
}

export interface Ingrediente {
  id: string
  prato_id: string
  nome: string
  quantidade: string | null
  ordem: number
}

/** O que esta casa costuma comprar. Aprendido, não escrito. */
export interface Artigo {
  id: string
  chave: string
  nome: string
  quantidade: string | null
  preco: number | null
  vezes: number
}

/** Coisas que se compram sempre juntas. */
export interface Conjunto {
  id: string
  nome: string
  itens: ItemDeConjunto[]
}

export interface ItemDeConjunto {
  id: string
  conjunto_id: string
  nome: string
  quantidade: string | null
  ordem: number
}

/** Uma linha da lista de compras. */
export interface Compra {
  id: string
  semana: string
  nome: string
  quantidade: string | null
  comprado: boolean
  /** Opcional, em euros. */
  preco: number | null
  /** De que jantar veio. Null = escrito à mão. */
  origem_entrada_id: string | null
  prato_id: string | null
  /** Mexido à mão depois de ter vindo de um prato: deixa de sair sozinho. */
  editado: boolean
  /** Nome do prato que o pôs cá, para o mostrar impresso ao lado. */
  prato_nome?: string | null
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
  hora_fim?: string | null
  fim_data?: string | null
  /** Geradas pela base de dados: a data real em que começa e em que acaba. */
  inicio_data?: string | null
  fim_efectivo?: string | null
  refeicao: Refeicao | null
  feita: boolean
  extensao: 'inicio' | 'meio' | 'fim' | null
  riscada: boolean
  movida_para: number | null
  prato_id?: string | null
}

export const daBaseDeDados = (l: EntradaDb): Entrada => ({
  id: l.id,
  dia: l.dia,
  genero: l.genero,
  autor: l.autor,
  texto: l.texto,
  hora: l.hora,
  horaFim: l.hora_fim ?? null,
  fimData: l.fim_data ?? null,
  inicioData: l.inicio_data ?? null,
  refeicao: l.refeicao ?? undefined,
  feita: l.feita,
  extensao: l.extensao ?? undefined,
  riscada: l.riscada || undefined,
  movidaPara: l.movida_para,
  pratoId: l.prato_id ?? null,
})

export const paraBaseDeDados = (e: Partial<Entrada>): Record<string, unknown> => {
  const l: Record<string, unknown> = {}
  if ('dia' in e) l.dia = e.dia
  if ('genero' in e) l.genero = e.genero
  if ('autor' in e) l.autor = e.autor ?? null
  if ('texto' in e) l.texto = e.texto
  if ('hora' in e) l.hora = e.hora ?? null
  if ('horaFim' in e) l.hora_fim = e.horaFim ?? null
  if ('fimData' in e) l.fim_data = e.fimData ?? null
  /* `inicio_data` é gerada pela base de dados: escrevê-la seria um erro. */
  if ('refeicao' in e) l.refeicao = e.refeicao ?? null
  if ('feita' in e) l.feita = e.feita ?? false
  /* `extensao` não vai daqui para a base de dados: passou a ser deduzida do
     intervalo. A coluna fica lá para as linhas antigas se lerem. */
  if ('riscada' in e) l.riscada = e.riscada ?? false
  if ('movidaPara' in e) l.movida_para = e.movidaPara ?? null
  if ('pratoId' in e) l.prato_id = e.pratoId ?? null
  return l
}
