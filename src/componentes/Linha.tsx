import { AUTORES, tintaDe, type Autor, type Entrada } from '../dominio/tipos'
import { DIAS } from '../dominio/semana'
import { Menu, type Opcao } from './Menu'
import { Visto } from './Marcar'
import { IPontos, ISetaMudanca } from './Icones'
import { Escrita } from './Escrita'
import { BotaoDePeriodo, resumoDoPeriodo, type Parte } from './Periodo'

const AUTOR_IDS: Autor[] = ['pai', 'mae', 'filha', 'casa']

/** Uma linha da semana: quem, o quê, quando, feito. Tipo e espaço — sem caixas. */
export function Linha({ entrada, contexto, parte = 'unico', dataDoInicio, aoAlterar, aoApagar, aoMover }: {
  entrada: Entrada
  /** Onde esta linha vive, para quem ouve a página em vez de a ver. */
  contexto: string
  /** Onde este dia cai dentro do período — deduzido pela semana. */
  parte?: Parte
  /** O dia em que o período começa. Sem período, é o próprio dia. */
  dataDoInicio?: Date
  aoAlterar: (mudanca: Partial<Entrada>) => void
  aoApagar: () => void
  aoMover: (destino: number | null) => void
}) {
  const tinta = tintaDe(entrada.autor)
  const feita = entrada.genero === 'tarefa' && entrada.feita
  const continuacao = parte === 'meio' || parte === 'fim'
    || entrada.extensao === 'meio' || entrada.extensao === 'fim'
  const periodo = dataDoInicio ? resumoDoPeriodo(entrada, dataDoInicio) : null

  const opcoesAutor: Opcao[] = [
    ...AUTOR_IDS.map(a => ({
      id: a,
      rotulo: AUTORES[a].nome,
      tinta: AUTORES[a].tinta,
      activa: entrada.autor === a,
      aoEscolher: () => aoAlterar({ autor: a }),
    })),
    { id: 'sem', rotulo: 'Sem ninguém', activa: !entrada.autor, aoEscolher: () => aoAlterar({ autor: null }) },
  ]

  const opcoesRefeicao: Opcao[] = [
    { id: 'almoco', rotulo: 'Almoço', activa: entrada.refeicao === 'almoco', aoEscolher: () => aoAlterar({ refeicao: 'almoco' }) },
    { id: 'jantar', rotulo: 'Jantar', activa: entrada.refeicao === 'jantar', aoEscolher: () => aoAlterar({ refeicao: 'jantar' }) },
  ]

  const opcoesLinha: Opcao[] = [
    ...DIAS.map((d, i) => ({
      id: `d${i}`,
      rotulo: d,
      activa: entrada.dia === i,
      aoEscolher: () => aoMover(i),
    })),
    { id: 'sem-data', rotulo: 'Esta semana, sem dia', activa: entrada.dia === null, aoEscolher: () => aoMover(null) },

    { id: 'apagar', rotulo: 'Apagar a linha', tinta: 'var(--perigo)', aoEscolher: aoApagar },
  ]

  if (entrada.riscada) {
    const destino = entrada.movidaPara === null ? 'sem dia' : DIAS[entrada.movidaPara ?? 0]
    return (
      <div className="fila fila--riscada">
        <span className="fila-corpo">
          <span className="fila-nome">{entrada.texto}</span>
          <span className="fila-mudanca"><ISetaMudanca />foi para {destino.toLowerCase()}</span>
        </span>
        <button type="button" className="botao-gelo" onClick={aoApagar}>
          <span className="sr-only">{contexto}: apagar a linha riscada “{entrada.texto}”</span>
          <IPontos />
        </button>
      </div>
    )
  }

  return (
    <div className="fila" data-feita={feita || undefined}>
      {entrada.genero === 'tarefa' && (
        <Visto
          feita={!!entrada.feita}
          aoAlternar={() => aoAlterar({ feita: !entrada.feita })}
          rotulo={`${contexto}: marcar “${entrada.texto || 'linha em branco'}” como feita`}
        />
      )}

      <span className="fila-corpo">
        <Escrita
          valor={entrada.texto}
          rotulo={`${contexto}: o que está escrito nesta linha`}
          cor={continuacao || feita ? 'var(--tinta-3)' : tinta}
          aoMudar={texto => aoAlterar({ texto })}
        />
        <span className="fila-meta">
          {entrada.genero === 'refeicao' ? (
            <Menu
              titulo="Que refeição"
              opcoes={opcoesRefeicao}
              gatilho={({ abrir, refs, controla, aberto }) => (
                <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                  aria-expanded={aberto} aria-controls={controla} className="autor">
                  {entrada.refeicao === 'almoco' ? 'Almoço' : 'Jantar'}
                </button>
              )}
            />
          ) : (
            <Menu
              titulo="De quem é"
              opcoes={opcoesAutor}
              gatilho={({ abrir, refs, controla, aberto }) => (
                <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                  aria-expanded={aberto} aria-controls={controla}
                  className="autor" style={{ color: tinta }}>
                  <span className="autor-ponto" aria-hidden="true" />
                  {entrada.autor ? AUTORES[entrada.autor].etiqueta : 'De quem?'}
                </button>
              )}
            />
          )}
          {periodo && <span className="fila-periodo">{periodo}</span>}
          {continuacao && !periodo && <span>continua</span>}
        </span>
      </span>

      {entrada.genero !== 'refeicao' && (
        <BotaoDePeriodo
          entrada={entrada}
          parte={parte}
          dataDoInicio={dataDoInicio ?? new Date()}
          contexto={contexto}
          aoAlterar={aoAlterar}
        />
      )}

      <Menu
        titulo="Mover para"
        alinhar="direita"
        opcoes={opcoesLinha}
        gatilho={({ abrir, refs, controla, aberto }) => (
          <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
            aria-expanded={aberto} aria-controls={controla} className="botao-gelo">
            <span className="sr-only">{contexto}: mover ou apagar “{entrada.texto || 'linha em branco'}”</span>
            <IPontos />
          </button>
        )}
      />
    </div>
  )
}
