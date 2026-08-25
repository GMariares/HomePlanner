import { useState } from 'react'
import { Casa } from './componentes/Casa'
import { Concha, type Vista } from './componentes/Concha'
import { Ementa } from './componentes/Ementa'
import { Entrar } from './componentes/Entrar'
import { Financas } from './componentes/Financas'
import { Inicio } from './componentes/Inicio'
import { Livro } from './componentes/Livro'
import { Semana } from './componentes/Semana'
import { useSessao } from './dominio/sessao'

export default function App() {
  const { sessao, recarregar, sair, sairDaCasa } = useSessao()
  const [vista, definirVista] = useState<Vista>('inicio')

  switch (sessao.fase) {
    case 'a-carregar':
      return (
        <main className="portada">
          <p className="portada-espera">A abrir a casa…</p>
        </main>
      )

    case 'por-configurar':
      return (
        <main className="portada">
          <div className="cartao-portada">
            <h1 className="portada-titulo">Falta a ligação ao Supabase</h1>
            <p className="portada-texto">
              Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> num
              ficheiro <code>.env</code> e volte a arrancar.
            </p>
          </div>
        </main>
      )

    case 'sem-migracao':
      return (
        <main className="portada">
          <div className="cartao-portada">
            <h1 className="portada-titulo">A base de dados está vazia</h1>
            <p className="portada-texto">
              Corra <code>supabase/migrations/20260824120000_caderneta.sql</code> no SQL Editor
              do projecto. É uma vez só: cria as tabelas e as regras de acesso.
            </p>
          </div>
        </main>
      )

    case 'erro':
      return (
        <main className="portada">
          <div className="cartao-portada">
            <p className="recado-erro" role="alert">{sessao.recado}</p>
            <h1 className="portada-titulo">Não foi possível abrir a casa</h1>
            <p className="portada-texto">{sessao.email}</p>
            <button type="button" className="pilula" onClick={recarregar}>Tentar outra vez</button>
            <div className="conta-accoes">
              <button type="button" className="botao-texto" onClick={sairDaCasa}>Sair desta casa</button>
              <button type="button" className="botao-texto" onClick={sair}>Sair desta conta</button>
            </div>
          </div>
        </main>
      )

    case 'sem-sessao':
      return <Entrar />

    case 'sem-casa':
      return <Casa email={sessao.email} aoEntrar={recarregar} aoSair={sair} aoSairDaCasa={sairDaCasa} />

    case 'pronto':
      return (
        <Concha
          casa={sessao.casa}
          email={sessao.email}
          vista={vista}
          aoTrocarDeVista={definirVista}
          aoSair={sair}
          aoSairDaCasa={sairDaCasa}
        >
          {vista === 'inicio' && <Inicio casa={sessao.casa} aoIr={definirVista} />}
          {vista === 'semana' && <Semana casa={sessao.casa} />}
          {vista === 'ementa' && <Ementa casa={sessao.casa} />}
          {vista === 'livro' && <Livro casa={sessao.casa} />}
          {vista === 'financas' && <Financas casa={sessao.casa} />}
        </Concha>
      )
  }
}
