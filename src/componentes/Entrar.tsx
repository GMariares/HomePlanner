import { useState, type FormEvent } from 'react'
import { supabase } from '../dominio/supabase'
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
        <div className="etiqueta-capa">
          <h1 className="etiqueta-titulo">Falta confirmar o email</h1>
          <p className="etiqueta-texto">
            Foi enviada uma mensagem para <strong>{email}</strong>. Abra o link que vem lá
            e volte aqui para entrar.
          </p>
          <button type="button" className="botao-linha impresso" onClick={() => { definirPorConfirmar(false); definirModo('entrar') }}>
            Voltar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="portada">
      <form className="etiqueta-capa" onSubmit={submeter}>
        <p className="etiqueta-marca impresso">HomePlanner</p>
        <h1 className="etiqueta-titulo">A semana da família</h1>

        <label className="campo">
          <span className="impresso">Email</span>
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
          <span className="impresso">Palavra-passe</span>
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

        <button type="submit" className="botao-capa" disabled={aTratar}>
          {aTratar ? 'Um momento…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          type="button"
          className="botao-linha impresso"
          onClick={() => { definirModo(m => (m === 'entrar' ? 'criar' : 'entrar')); definirErro(null) }}
        >
          {modo === 'entrar' ? 'Ainda não tenho conta' : 'Já tenho conta'}
        </button>
      </form>
    </main>
  )
}
