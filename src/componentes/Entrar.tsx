import { useState, type FormEvent } from 'react'
import { supabase } from '../dominio/supabase'
import { ICasa } from './Icones'
import { recado } from '../dominio/recados'

/**
 * A entrada é a capa do caderno: a etiqueta branca que se cola à frente,
 * com o nome escrito à mão. Não é um ecrã de login em cima de outra coisa.
 */
export function Entrar() {
  const [modo, definirModo] = useState<'entrar' | 'criar'>('entrar')
  const [email, definirEmail] = useState('')
  const [palavra, definirPalavra] = useState('')
  const [aTratar, definirATratar] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const [porConfirmar, definirPorConfirmar] = useState(false)
  const [reenviado, definirReenviado] = useState<'nao' | 'a-enviar' | 'enviado'>('nao')

  const reenviar = async () => {
    definirErro(null)
    definirReenviado('a-enviar')
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) throw error
      definirReenviado('enviado')
    } catch (falha) {
      definirReenviado('nao')
      definirErro(recado(falha))
    }
  }

  const submeter = async (e: FormEvent) => {
    e.preventDefault()
    definirErro(null)
    definirATratar(true)
    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: palavra })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: palavra })
        if (error) throw error
        if (!data.session) definirPorConfirmar(true)
      }
    } catch (falha) {
      definirErro(recado(falha))
    } finally {
      definirATratar(false)
    }
  }

  if (porConfirmar) {
    return (
      <main className="portada">
        <div className="cartao-portada">
          <h1 className="portada-titulo">Falta confirmar o email</h1>
          <p className="portada-texto">
            Foi enviada uma mensagem para <strong>{email}</strong>. Abra o link que vem lá
            e volte aqui para entrar.
          </p>
          <p className="portada-texto">
            Se não chegou em poucos minutos, veja o spam. O serviço de email que vem de
            origem com o Supabase é limitado e nem sempre entrega — quem gere o projecto
            pode desligar a confirmação, ou ligar um SMTP próprio.
          </p>

          {erro && <p className="recado-erro" role="alert">{erro}</p>}
          {reenviado === 'enviado' && (
            <p className="portada-texto" role="status">Mensagem reenviada.</p>
          )}

          <button
            type="button"
            className="pilula"
            onClick={reenviar}
            disabled={reenviado === 'a-enviar'}
          >
            {reenviado === 'a-enviar' ? 'A reenviar…' : 'Enviar outra vez'}
          </button>

          <button type="button" className="botao-texto" onClick={() => { definirPorConfirmar(false); definirModo('entrar'); definirErro(null) }}>
            Voltar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="portada">
      <form className="cartao-portada" onSubmit={submeter}>
        <span className="marca-tile" aria-hidden="true"><ICasa lado={24} /></span>
        <h1 className="portada-titulo">HomePlanner</h1>
        <p className="portada-texto">A semana, a ementa e as contas da casa — num sítio só.</p>

        <label className="campo">
          <span className="campo-nome">Email</span>
          <input
            type="email"
            className="campo-escrita"
            value={email}
            onChange={e => definirEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="campo">
          <span className="campo-nome">Palavra-passe</span>
          <input
            type="password"
            className="campo-escrita"
            value={palavra}
            onChange={e => definirPalavra(e.target.value)}
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
        </label>

        {erro && <p className="recado-erro" role="alert">{erro}</p>}

        <button type="submit" className="pilula" disabled={aTratar}>
          {aTratar ? 'Um momento…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          type="button"
          className="botao-texto"
          onClick={() => { definirModo(m => (m === 'entrar' ? 'criar' : 'entrar')); definirErro(null) }}
        >
          {modo === 'entrar' ? 'Ainda não tenho conta' : 'Já tenho conta'}
        </button>
      </form>
    </main>
  )
}
