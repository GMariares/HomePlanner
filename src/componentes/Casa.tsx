import { useState, type FormEvent } from 'react'
import { supabase } from '../dominio/supabase'
import { recado } from '../dominio/recados'

/** Uma caderneta é de uma casa. Ou se abre uma, ou se entra na que já existe. */
export function Casa({ email, aoEntrar, aoSair, aoSairDaCasa }: {
  email: string
  aoEntrar: () => void | Promise<void>
  aoSair: () => void
  aoSairDaCasa: () => void | Promise<void>
}) {
  const [modo, definirModo] = useState<'criar' | 'juntar'>('criar')
  const [nome, definirNome] = useState('')
  const [codigo, definirCodigo] = useState('')
  const [aTratar, definirATratar] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)

  const submeter = async (e: FormEvent) => {
    e.preventDefault()
    definirErro(null)
    definirATratar(true)
    try {
      const { error } =
        modo === 'criar'
          ? await supabase.rpc('criar_casa', { nome })
          : await supabase.rpc('entrar_em_casa', { codigo })
      if (error) throw error
      await aoEntrar()
    } catch (falha) {
      /* "Já pertence a uma casa" quer dizer que a caderneta existe e é desta
         conta — o sítio certo é lá dentro, não este ecrã. */
      const texto = String((falha as { message?: string })?.message ?? falha)
      if (/já pertence/i.test(texto)) { await aoEntrar(); return }
      definirErro(recado(falha))
    } finally {
      definirATratar(false)
    }
  }

  return (
    <main className="portada">
      <form className="cartao-portada" onSubmit={submeter}>
        <h1 className="portada-titulo">
          {modo === 'criar' ? 'Abrir uma caderneta' : 'Entrar numa caderneta'}
        </h1>

        {modo === 'criar' ? (
          <>
            <label className="campo">
              <span className="campo-nome">Nome da família</span>
              <input
                className="campo-escrita"
                value={nome}
                onChange={e => definirNome(e.target.value)}
                placeholder="os Silva"
                maxLength={32}
              />
            </label>
            <p className="portada-texto">
              Fica com um código de seis letras. Quem o tiver entra na mesma caderneta.
            </p>
          </>
        ) : (
          <>
            <label className="campo">
              <span className="campo-nome">Código da casa</span>
              <input
                className="campo-escrita campo-escrita--codigo"
                value={codigo}
                onChange={e => definirCodigo(e.target.value.toUpperCase())}
                placeholder="ABC234"
                maxLength={6}
                required
              />
            </label>
            <p className="portada-texto">Peça o código a quem já tem a caderneta aberta.</p>
          </>
        )}

        {erro && <p className="recado-erro" role="alert">{erro}</p>}

        <button type="submit" className="pilula" disabled={aTratar}>
          {aTratar ? 'Um momento…' : modo === 'criar' ? 'Abrir a caderneta' : 'Entrar'}
        </button>

        <button type="button" className="botao-texto"
          onClick={() => { definirModo(m => (m === 'criar' ? 'juntar' : 'criar')); definirErro(null) }}>
          {modo === 'criar' ? 'Já existe uma caderneta cá em casa' : 'Quero abrir uma caderneta nova'}
        </button>

        <button type="button" className="botao-texto" onClick={() => aoSairDaCasa()}>
          Estou preso a uma casa antiga — sair dela
        </button>
        <button type="button" className="botao-texto" onClick={aoSair}>Sair desta conta</button>
        <p className="portada-conta">{email}</p>
      </form>
    </main>
  )
}
