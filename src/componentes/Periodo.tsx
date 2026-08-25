import { useEffect, useRef, useState } from 'react'
import type { Entrada } from '../dominio/tipos'
import { chaveDeData, curto, dataDeChave, diaCurto, diasEntre, somarDias } from '../dominio/semana'
import { ISetaDir } from './Icones'

/** "1430" e "14h30" são as 14:30. Vazio é vazio, não é meia-noite. */
export function lerHora(t: string): string | null {
  const digitos = t.replace(/\D/g, '').slice(0, 4)
  if (!digitos) return null
  if (digitos.length <= 2) return digitos
  return `${digitos.slice(0, 2)}:${digitos.slice(2)}`
}

/** Arruma-se ao sair do campo, nunca a meio de se escrever. */
export function arrumarHora(t: string): string | null {
  const digitos = t.replace(/\D/g, '')
  if (!digitos) return null
  const n = (digitos.length <= 2 ? digitos.padStart(2, '0') : digitos.padStart(4, '0')).slice(0, 4)
  const h = Math.min(23, Number(n.slice(0, 2) || 0))
  const m = n.length > 2 ? Math.min(59, Number(n.slice(2))) : 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Onde é que um dia cai dentro do período de uma entrada. */
export type Parte = 'unico' | 'inicio' | 'meio' | 'fim'

export function parteDoDia(entrada: Entrada, dataDoInicio: Date, dataDoDia: Date): Parte {
  if (!entrada.fimData) return 'unico'
  const fim = dataDeChave(entrada.fimData)
  if (diasEntre(dataDoInicio, fim) <= 0) return 'unico'
  if (diasEntre(dataDoDia, fim) === 0) return 'fim'
  if (diasEntre(dataDoInicio, dataDoDia) === 0) return 'inicio'
  return 'meio'
}

/**
 * O que este dia leva. A quem olha para uma terça não interessa o período
 * inteiro — interessa quando é que aquilo ocupa a terça.
 */
export function horasDoDia(entrada: Entrada, parte: Parte) {
  if (parte === 'unico') return { cima: entrada.hora ?? null, baixo: entrada.horaFim ?? null }
  if (parte === 'inicio') return { cima: entrada.hora ?? null, baixo: null }
  if (parte === 'fim') return { cima: null, baixo: entrada.horaFim ?? null }
  return { cima: null, baixo: null }
}

/** "31/08 → 03/09" — o período inteiro, de uma vista de olhos. */
export function resumoDoPeriodo(entrada: Entrada, dataDoInicio: Date): string | null {
  if (!entrada.fimData) return null
  const fim = dataDeChave(entrada.fimData)
  if (diasEntre(dataDoInicio, fim) <= 0) return null
  return `${curto(dataDoInicio)} → ${curto(fim)}`
}

/**
 * O painel das horas.
 *
 * Princípio e fim são a mesma pergunta feita duas vezes: a que horas começa,
 * e a que horas — e em que dia — acaba. Quem só quer uma hora escreve uma e
 * ignora o resto; quem tem o pai fora de segunda a quinta muda o dia do fim
 * e está feito. É o mesmo controlo para os dois casos porque são o mesmo caso.
 */
export function EditorDePeriodo({ entrada, dataDoInicio, aoAlterar, aoFechar }: {
  entrada: Entrada
  dataDoInicio: Date
  aoAlterar: (mudanca: Partial<Entrada>) => void
  aoFechar: () => void
}) {
  const [comeca, definirComeca] = useState(entrada.hora ?? '')
  const [acaba, definirAcaba] = useState(entrada.horaFim ?? '')
  const caixa = useRef<HTMLDivElement>(null)
  const primeiro = useRef<HTMLInputElement>(null)

  useEffect(() => { primeiro.current?.focus() }, [])

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') aoFechar() }
    const fora = (e: MouseEvent) => { if (!caixa.current?.contains(e.target as Node)) aoFechar() }
    document.addEventListener('keydown', tecla)
    document.addEventListener('mousedown', fora)
    return () => {
      document.removeEventListener('keydown', tecla)
      document.removeEventListener('mousedown', fora)
    }
  }, [aoFechar])

  /* Os dias que o fim pode tomar: o próprio e os catorze seguintes. Datas a
     sério, e por isso uma viagem que passa do fim do mês ou do fim da semana
     escreve-se aqui como se diz em voz alta. */
  const dias = Array.from({ length: 15 }, (_, i) => somarDias(dataDoInicio, i))
  const fimEscolhido = entrada.fimData ?? chaveDeData(dataDoInicio)
  const temAlgo = Boolean(entrada.hora || entrada.horaFim || entrada.fimData)

  return (
    <div className="periodo-painel" ref={caixa} role="dialog" aria-label="As horas desta linha">
      <label className="periodo-linha">
        <span className="campo-nome">Começa</span>
        <input
          ref={primeiro}
          className="campo-escrita periodo-hora"
          value={comeca}
          onChange={e => { definirComeca(e.target.value); aoAlterar({ hora: lerHora(e.target.value) }) }}
          onBlur={() => { const h = arrumarHora(comeca); definirComeca(h ?? ''); aoAlterar({ hora: h }) }}
          placeholder="--:--"
          inputMode="numeric"
          maxLength={5}
        />
      </label>

      <div className="periodo-linha">
        <span className="campo-nome" id={`ate-${entrada.id}`}>Acaba</span>
        <span className="periodo-fim">
          <select
            className="campo-escrita periodo-dia"
            value={fimEscolhido}
            onChange={e => {
              const mesmoDia = e.target.value === chaveDeData(dataDoInicio)
              aoAlterar({ fimData: mesmoDia ? null : e.target.value })
            }}
            aria-labelledby={`ate-${entrada.id}`}
          >
            {dias.map((d, i) => (
              <option key={i} value={chaveDeData(d)}>{i === 0 ? 'no mesmo dia' : diaCurto(d)}</option>
            ))}
          </select>
          <input
            className="campo-escrita periodo-hora"
            value={acaba}
            onChange={e => { definirAcaba(e.target.value); aoAlterar({ horaFim: lerHora(e.target.value) }) }}
            onBlur={() => { const h = arrumarHora(acaba); definirAcaba(h ?? ''); aoAlterar({ horaFim: h }) }}
            placeholder="--:--"
            inputMode="numeric"
            maxLength={5}
            aria-label="A que horas acaba"
          />
        </span>
      </div>

      {temAlgo && (
        <button
          type="button"
          className="botao-texto periodo-tirar"
          onClick={() => {
            definirComeca(''); definirAcaba('')
            aoAlterar({ hora: null, horaFim: null, fimData: null })
            aoFechar()
          }}
        >
          Tirar as horas
        </button>
      )}
    </div>
  )
}

/**
 * O botão das horas, na coluna fixa. Mostra o que este dia leva — no máximo
 * duas linhas, começa em cima e acaba em baixo, como um intervalo se lê numa
 * agenda — e abre o painel. É o único gesto da linha para as horas.
 */
export function BotaoDePeriodo({ entrada, parte, dataDoInicio, contexto, aoAlterar }: {
  entrada: Entrada
  parte: Parte
  dataDoInicio: Date
  contexto: string
  aoAlterar: (mudanca: Partial<Entrada>) => void
}) {
  const [aberto, definirAberto] = useState(false)
  const { cima, baixo } = horasDoDia(entrada, parte)
  const vazio = !cima && !baixo && parte === 'unico'

  return (
    <span className="periodo-raiz">
      <button
        type="button"
        className="periodo-botao"
        data-vazio={vazio || undefined}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => definirAberto(v => !v)}
      >
        <span className="sr-only">{contexto}: as horas de “{entrada.texto || 'linha em branco'}”</span>
        {vazio ? (
          <span className="periodo-ghost" aria-hidden="true">--:--</span>
        ) : (
          <>
            {cima && (
              <span className="periodo-num">
                {cima}
                {parte === 'inicio' && (
                  <span className="periodo-corre" aria-hidden="true"><ISetaDir lado={13} /></span>
                )}
              </span>
            )}
            {parte === 'meio' && <span className="periodo-todo">todo o dia</span>}
            {baixo && (
              <span className="periodo-num periodo-num--fim">
                <span className="periodo-sinal" aria-hidden="true">{parte === 'fim' ? '→' : '–'}</span>
                {baixo}
              </span>
            )}
          </>
        )}
      </button>
      {aberto && (
        <EditorDePeriodo
          entrada={entrada}
          dataDoInicio={dataDoInicio}
          aoAlterar={aoAlterar}
          aoFechar={() => definirAberto(false)}
        />
      )}
    </span>
  )
}
