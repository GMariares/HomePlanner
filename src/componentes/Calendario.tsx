import { useState } from 'react'
import { supabase } from '../dominio/supabase'
import { esquemaAtrasado } from '../dominio/supabase'
import { ICalendario } from './Icones'

/**
 * A agenda da casa no calendário do telemóvel.
 *
 * O endereço é a chave: quem o tiver vê a agenda desta casa, sem conta e
 * sem palavra-passe. Por isso está dito na página, e por isso trocá-lo é
 * um botão e não uma definição escondida.
 */
export function Calendario({ token, aoMudar }: {
  token: string | null | undefined
  aoMudar: (t: string | null) => void
}) {
  const [aTratar, definirATratar] = useState(false)
  const [copiado, definirCopiado] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const [aConfirmar, definirAConfirmar] = useState(false)

  const endereco = token ? `${location.origin}/api/calendario/${token}.ics` : null
  const webcal = endereco ? endereco.replace(/^https?:/, 'webcal:') : null

  const chamar = async (nome: 'ligar_calendario' | 'desligar_calendario') => {
    definirATratar(true)
    definirErro(null)
    const { data, error } = await supabase.rpc(nome)
    definirATratar(false)
    if (error) {
      definirErro(
        esquemaAtrasado(error) || error.code === 'PGRST202'
          ? 'Falta correr a migração do calendário no projecto.'
          : 'Não foi possível falar com o servidor.',
      )
      return
    }
    aoMudar(nome === 'ligar_calendario' ? (data as string) : null)
    definirAConfirmar(false)
  }

  const copiar = async () => {
    if (!endereco) return
    try {
      await navigator.clipboard.writeText(endereco)
      definirCopiado(true)
      setTimeout(() => definirCopiado(false), 2500)
    } catch {
      definirErro('Não deu para copiar. Marque o endereço e copie à mão.')
    }
  }

  return (
    <div className="calendario">
      <p className="campo-nome calendario-titulo">
        <ICalendario lado={15} />
        Calendário no telemóvel
      </p>

      {!token ? (
        <>
          <p className="conta-nota">
            Publica a agenda desta casa para o telemóvel a ler — aparece ao lado
            dos compromissos do trabalho e actualiza-se sozinha.
          </p>
          <button type="button" className="chip" disabled={aTratar}
            onClick={() => chamar('ligar_calendario')}>
            {aTratar ? 'Um momento…' : 'Ligar o calendário'}
          </button>
        </>
      ) : (
        <>
          <a className="chip calendario-adicionar" href={webcal ?? '#'}>
            Adicionar a este telemóvel
          </a>

          <p className="calendario-endereco" title={endereco ?? ''}>{endereco}</p>
          <div className="conta-accoes">
            <button type="button" className="botao-texto" onClick={copiar}>
              {copiado ? 'copiado' : 'copiar o endereço'}
            </button>
            <button type="button" className="botao-texto" disabled={aTratar}
              onClick={() => chamar('ligar_calendario')}>
              trocar
            </button>
            <button type="button" className="botao-texto botao-texto--perigo" disabled={aTratar}
              onClick={() => definirAConfirmar(true)}>
              desligar
            </button>
          </div>

          {aConfirmar && (
            <p className="confirmar" role="alert">
              <span>Desligar tira o calendário dos telemóveis onde já foi adicionado.</span>
              <button type="button" className="botao-texto botao-texto--perigo"
                onClick={() => chamar('desligar_calendario')}>Desligar</button>
              <button type="button" className="botao-texto"
                onClick={() => definirAConfirmar(false)}>Deixar ficar</button>
            </p>
          )}

          <p className="conta-nota">
            Quem tiver este endereço vê a agenda desta casa. Trocar dá um endereço
            novo e fecha o antigo.
          </p>

          <details className="calendario-ajuda">
            <summary>Como adicionar noutro telemóvel</summary>
            <p>
              <strong>iPhone:</strong> abra o endereço no telemóvel, ou vá a Definições ›
              Aplicações › Calendário › Contas › Adicionar conta › Outra › Adicionar
              calendário subscrito.
            </p>
            <p>
              <strong>Android:</strong> em calendar.google.com, Outros calendários ›
              A partir do URL. O Google pode demorar algumas horas a mostrar mudanças.
            </p>
            <p>A agenda entra só para leitura: escreve-se aqui, lê-se lá.</p>
          </details>
        </>
      )}

      {erro && <p className="recado-erro" role="alert">{erro}</p>}
    </div>
  )
}
