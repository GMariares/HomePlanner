import { AUTORES, tintaDe, type Autor, type Entrada } from '../dominio/tipos'
import { DIAS } from '../dominio/semana'
import { Menu, type Opcao } from './Menu'
import { CampoDeCarimbo } from './Carimbo'
import { Chaveta, Reticencias, SetaMudanca } from './Icones'
import { Escrita } from './Escrita'

const AUTOR_IDS: Autor[] = ['pai', 'mae', 'filha', 'casa']

export function Linha({ entrada, contexto, destaque, aoAlterar, aoApagar, aoMover }: {
  entrada: Entrada
  /** Onde esta linha vive, para quem ouve a página em vez de a ver. */
  contexto: string
  /** A primeira linha do dia: é a que se lê primeiro, e é a que sobe de escala. */
  destaque?: boolean
  aoAlterar: (mudanca: Partial<Entrada>) => void
  aoApagar: () => void
  aoMover: (destino: number | null) => void
}) {
  const tinta = tintaDe(entrada.autor)
  const feita = entrada.genero === 'tarefa' && entrada.feita
  const continuacao = entrada.extensao === 'meio' || entrada.extensao === 'fim'
  /** Uma tarefa pode ter hora marcada; se tiver, abre coluna para ela. */
  const comHora = entrada.genero === 'tarefa' && entrada.hora !== null && entrada.hora !== undefined

  /* A tinta do texto sai daqui e não do CSS: o `style` em linha ganha sempre
     à folha de estilos, e uma regra que nunca se aplica não é uma decisão.
     Uma continuação e uma tarefa cumprida recuam para a tinta do impresso —
     lêem-se na mesma, mas não competem com o que ainda está por acontecer. */
  const corDoTexto =
    entrada.genero === 'refeicao' ? 'var(--casa)'
    : continuacao || feita ? 'var(--impresso-tinta)'
    : tinta

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
    ...(entrada.genero === 'tarefa'
      ? [{
          id: 'hora',
          rotulo: entrada.hora === null || entrada.hora === undefined ? 'Marcar uma hora' : 'Tirar a hora',
          aoEscolher: () => aoAlterar({ hora: entrada.hora === null || entrada.hora === undefined ? '' : null }),
        }]
      : []),
    { id: 'apagar', rotulo: 'Apagar a linha', tinta: 'var(--margem)', aoEscolher: aoApagar },
  ]

  if (entrada.riscada) {
    const destino = entrada.movidaPara === null ? 'sem dia' : DIAS[entrada.movidaPara ?? 0]
    return (
      <div className="linha linha--riscada">
        <span className="linha-goteira" />
        <span className="linha-corpo">
          <s>{entrada.texto}</s>
          <span className="linha-mudanca">
            <SetaMudanca />
            {destino.toLowerCase()}
          </span>
        </span>
        <span className="linha-hora" />
        <span className="linha-accoes">
          <button type="button" className="botao-nu" onClick={aoApagar}>
            <span className="sr-only">{contexto}: apagar a linha riscada “{entrada.texto}”</span>
            <Reticencias />
          </button>
        </span>
      </div>
    )
  }

  return (
    <div
      className={`linha ${destaque ? 'linha--destaque' : ''}`}
      data-genero={entrada.genero}
      data-feita={feita || undefined}
      data-com-hora={comHora || undefined}
    >
      <span className="linha-goteira" style={{ color: tinta }}>
        {entrada.extensao ? (
          <span className="chaveta"><Chaveta parte={entrada.extensao} /></span>
        ) : null}
      </span>

      <span className="linha-corpo">
        {entrada.genero === 'refeicao' ? (
          <Menu
            titulo="Que refeição"
            opcoes={opcoesRefeicao}
            gatilho={({ abrir, refs, controla, aberto }) => (
              <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
                aria-expanded={aberto} aria-controls={controla} className="etiqueta etiqueta--impressa">
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
                className="etiqueta" style={{ color: tinta }}>
                {entrada.autor ? AUTORES[entrada.autor].etiqueta : '—'}
              </button>
            )}
          />
        )}

        <Escrita
          valor={entrada.texto}
          rotulo={`${contexto}: o que está escrito nesta linha`}
          cor={corDoTexto}
          esbatido={continuacao}
          aoMudar={texto => aoAlterar({ texto })}
        />
      </span>

      <span className="linha-hora">
        {entrada.genero === 'tarefa' && !comHora ? (
          <CampoDeCarimbo
            feita={!!entrada.feita}
            aoAlternar={() => aoAlterar({ feita: !entrada.feita })}
            rotulo={`${contexto}: dar o visto a “${entrada.texto || 'linha em branco'}”`}
          />
        ) : entrada.genero !== 'refeicao' ? (
          <input
            className="escrita escrita--hora"
            value={entrada.hora ?? ''}
            placeholder="--:--"
            inputMode="numeric"
            maxLength={5}
            aria-label={`${contexto}: horas de “${entrada.texto || 'linha em branco'}”`}
            onChange={e => aoAlterar({ hora: e.target.value })}
          />
        ) : null}
      </span>

      {comHora && (
        <span className="linha-carimbo">
          <CampoDeCarimbo
            feita={!!entrada.feita}
            aoAlternar={() => aoAlterar({ feita: !entrada.feita })}
            rotulo={`${contexto}: dar o visto a “${entrada.texto || 'linha em branco'}”`}
          />
        </span>
      )}

      <span className="linha-accoes">
        <Menu
          titulo="Mover para"
          alinhar="direita"
          opcoes={opcoesLinha}
          gatilho={({ abrir, refs, controla, aberto }) => (
            <button type="button" ref={refs} onClick={abrir} aria-haspopup="menu"
              aria-expanded={aberto} aria-controls={controla} className="botao-nu">
              <span className="sr-only">{contexto}: mover ou apagar “{entrada.texto || 'linha em branco'}”</span>
              <Reticencias />
            </button>
          )}
        />
      </span>
    </div>
  )
}
