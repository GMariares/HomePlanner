import type { Entrada } from './tipos'
import { chaveDeData, dataDeChave, somarDias } from './semana'

/**
 * CONTEÚDO DE EXEMPLO — não são dados reais de nenhuma família.
 * Os membros aparecem pelo papel que têm em casa (Pai, Mãe, Filha, Todos),
 * nunca por nome: nomes reais são dados que a família introduz.
 * A semana está deliberadamente leve, cerca de dez entradas, porque é assim
 * que esta casa é: domingo fica vazio de propósito, para se ver a pauta à espera.
 */
/** Quantos dias cada linha ocupa. 1 = só o seu dia. */
type Modelo = Omit<Entrada, 'fimData'> & { dias?: number }

const MODELO: Modelo[] = [
  { id: 'e1', dia: 0, genero: 'evento', autor: 'mae', texto: 'Levar a filha à escola', hora: '08:30' },
  { id: 'e2', dia: 0, genero: 'refeicao', autor: null, texto: 'Massa com atum', hora: null, refeicao: 'jantar' },

  // Uma viagem de três dias é UMA linha, com princípio e fim. A semana
  // é que a escreve em cada dia por onde passa.
  { id: 'e3', dia: 1, genero: 'evento', autor: 'pai', texto: 'Viagem de trabalho — Lisboa', hora: '07:15', horaFim: '19:40', dias: 3 },
  { id: 'e4', dia: 1, genero: 'refeicao', autor: null, texto: 'Bacalhau à Brás', hora: null, refeicao: 'jantar' },

  { id: 'e6', dia: 2, genero: 'evento', autor: 'filha', texto: 'Natação', hora: '17:00', horaFim: '18:00' },

  // A reunião estava marcada para quarta e passou para quinta. A linha antiga
  // fica riscada onde estava: a agenda guarda o que aconteceu.
  { id: 'e13', dia: 2, genero: 'evento', autor: 'mae', texto: 'Reunião de pais', hora: '18:30', riscada: true, movidaPara: 3 },
  { id: 'e14', dia: 3, genero: 'evento', autor: 'mae', texto: 'Reunião de pais', hora: '18:30' },

  { id: 'e8', dia: 3, genero: 'refeicao', autor: null, texto: 'Arroz de pato', hora: null, refeicao: 'jantar' },

  { id: 'e9', dia: 4, genero: 'evento', autor: 'mae', texto: 'Espetáculo', hora: '21:00', horaFim: '23:30' },
  { id: 'e10', dia: 4, genero: 'tarefa', autor: 'casa', texto: 'Comprar os livros escolares', hora: '17:30', feita: false },
  { id: 'e11', dia: 4, genero: 'refeicao', autor: null, texto: 'Pizza', hora: null, refeicao: 'jantar' },

  { id: 'e12', dia: 5, genero: 'evento', autor: 'casa', texto: 'Almoço em casa dos avós', hora: '13:00', horaFim: '16:00' },

  // Domingo fica sem nada escrito. A pauta continua lá.

  { id: 'u1', dia: null, genero: 'tarefa', autor: 'mae', texto: 'Inscrever a filha no plano de refeições da escola', hora: null, feita: true },
  { id: 'u2', dia: null, genero: 'tarefa', autor: 'pai', texto: 'Arranjar a casa de banho', hora: null, feita: false },
  { id: 'u3', dia: null, genero: 'tarefa', autor: 'casa', texto: 'Marcar consulta no dentista', hora: null, feita: false },
]

/**
 * O exemplo escrito na semana que está aberta. Os períodos precisam de datas
 * a sério, e uma data só existe depois de se saber em que semana se escreve.
 */
export function exemploDaSemana(semana: string): Entrada[] {
  const segunda = dataDeChave(semana)
  return MODELO.map(({ dias, ...linha }) => ({
    ...linha,
    fimData:
      dias && dias > 1 && linha.dia !== null
        ? chaveDeData(somarDias(segunda, linha.dia + dias - 1))
        : null,
  }))
}
