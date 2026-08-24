import type { Entrada } from './tipos'

/**
 * CONTEÚDO DE EXEMPLO — não são dados reais de nenhuma família.
 * Os membros aparecem pelo papel que têm em casa (Pai, Mãe, Filha, Todos),
 * nunca por nome: nomes reais são dados que a família introduz.
 * A semana está deliberadamente leve, cerca de dez entradas, porque é assim
 * que esta casa é: domingo fica vazio de propósito, para se ver a pauta à espera.
 */
export const EXEMPLO: Entrada[] = [
  { id: 'e1', dia: 0, genero: 'evento', autor: 'mae', texto: 'Levar a filha à escola', hora: '08:30' },
  { id: 'e2', dia: 0, genero: 'refeicao', autor: null, texto: 'Massa com atum', hora: null, refeicao: 'jantar' },

  { id: 'e3', dia: 1, genero: 'evento', autor: 'pai', texto: 'Viagem de trabalho — Lisboa', hora: '07:15', extensao: 'inicio' },
  { id: 'e4', dia: 1, genero: 'refeicao', autor: null, texto: 'Bacalhau à Brás', hora: null, refeicao: 'jantar' },

  { id: 'e5', dia: 2, genero: 'evento', autor: 'pai', texto: 'Viagem de trabalho — Lisboa', hora: null, extensao: 'meio' },
  { id: 'e6', dia: 2, genero: 'evento', autor: 'filha', texto: 'Natação', hora: '17:00' },

  { id: 'e7', dia: 3, genero: 'evento', autor: 'pai', texto: 'Regresso de Lisboa', hora: '19:40', extensao: 'fim' },
  { id: 'e8', dia: 3, genero: 'refeicao', autor: null, texto: 'Arroz de pato', hora: null, refeicao: 'jantar' },

  { id: 'e9', dia: 4, genero: 'evento', autor: 'mae', texto: 'Espetáculo', hora: '21:00' },
  { id: 'e10', dia: 4, genero: 'tarefa', autor: 'casa', texto: 'Comprar os livros escolares', hora: null, feita: false },
  { id: 'e11', dia: 4, genero: 'refeicao', autor: null, texto: 'Pizza', hora: null, refeicao: 'jantar' },

  { id: 'e12', dia: 5, genero: 'evento', autor: 'casa', texto: 'Almoço em casa dos avós', hora: '13:00' },

  // Domingo fica sem nada escrito. A pauta continua lá.

  { id: 'u1', dia: null, genero: 'tarefa', autor: 'mae', texto: 'Inscrever a filha no plano de refeições da escola', hora: null, feita: true },
  { id: 'u2', dia: null, genero: 'tarefa', autor: 'pai', texto: 'Arranjar a casa de banho', hora: null, feita: false },
  { id: 'u3', dia: null, genero: 'tarefa', autor: 'casa', texto: 'Marcar consulta no dentista', hora: null, feita: false },
]
