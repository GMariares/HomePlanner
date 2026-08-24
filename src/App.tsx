import { Casa } from './componentes/Casa'
import { Entrar } from './componentes/Entrar'
import { Semana } from './componentes/Semana'
import { useSessao } from './dominio/sessao'

export default function App() {
  const { sessao, recarregar, sair } = useSessao()

  switch (sessao.fase) {
    case 'a-carregar':
      return (
        <main className="portada">
          <p className="portada-espera impresso">A abrir a caderneta…</p>
        </main>
      )

    case 'por-configurar':
      return (
        <main className="portada">
          <div className="etiqueta-capa">
            <h1 className="etiqueta-titulo">Falta a ligação ao Supabase</h1>
            <p className="etiqueta-texto">
              Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> num
              ficheiro <code>.env</code> e volte a arrancar.
            </p>
          </div>
        </main>
      )

    case 'sem-migracao':
      return (
        <main className="portada">
          <div className="etiqueta-capa">
            <h1 className="etiqueta-titulo">A base de dados está vazia</h1>
            <p className="etiqueta-texto">
              Corra <code>supabase/migrations/20260824120000_caderneta.sql</code> no SQL Editor
              do projecto. É uma vez só: cria as tabelas e as regras de acesso.
            </p>
          </div>
        </main>
      )

    case 'sem-sessao':
      return <Entrar />

    case 'sem-casa':
      return <Casa email={sessao.email} aoEntrar={recarregar} aoSair={sair} />

    case 'pronto':
      return <Semana casa={sessao.casa} email={sessao.email} aoSair={sair} />
  }
}
