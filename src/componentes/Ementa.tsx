import { useState } from 'react'
import { Cabecalho } from './Cabecalho'
import { ListaCompras } from './ListaCompras'
import { Tira } from './Tira'
import { useEmenta } from '../dominio/ementa'
import { supabase } from '../dominio/supabase'
import { chaveDaSemana, indiceDeHoje, inicioDaSemana } from '../dominio/semana'
import type { Casa } from '../dominio/tipos'

export function Ementa({ casa, email, aoSair, aoSairDaCasa, aoTrocarDeVista }: {
  casa: Casa
  email: string
  aoSair: () => void
  aoSairDaCasa: () => void | Promise<void>
  aoTrocarDeVista: (v: 'semana' | 'ementa' | 'livro') => void
}) {
  const [inicio, definirInicio] = useState(() => inicioDaSemana())
  const [aberto, definirAberto] = useState<number | null>(null)
  const [mostrarPrecos, definirMostrarPrecos] = useState(casa.mostrar_precos)

  /* Mostrar preços é decisão da casa, não do aparelho: fica guardada com ela. */
  const guardarMostrarPrecos = (v: boolean) => {
    definirMostrarPrecos(v)
    supabase.from('casas').update({ mostrar_precos: v }).eq('id', casa.id)
  }
  const chave = chaveDaSemana(inicio)
  const hoje = indiceDeHoje(inicio)
  const e = useEmenta(casa.id, chave)

  const mover7 = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n * 7); return x }

  return (
    <div className="caderneta">
      <Cabecalho
        casa={casa}
        email={email}
        inicio={inicio}
        aoRecuar={() => definirInicio(d => mover7(d, -1))}
        aoAvancar={() => definirInicio(d => mover7(d, 1))}
        aoHoje={() => definirInicio(inicioDaSemana())}
        naSemanaCorrente={hoje >= 0}
        aoSair={aoSair}
        aoSairDaCasa={aoSairDaCasa}
        vista="ementa"
        aoTrocarDeVista={aoTrocarDeVista}
      />

      {e.estado === 'a-carregar' && (
        <p className="aviso" role="status">
          <span>A abrir a ementa…</span>
        </p>
      )}

      {e.estado === 'sem-migracao' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem tabelas</span>
          <span>
            Falta a segunda migração. Corra
            <code> supabase/migrations/20260824130000_ementa.sql </code>
            no SQL Editor do projecto e recarregue.
          </span>
        </p>
      )}
      {e.semDespensa && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Falta a terceira migração</span>
          <span>
            A lista funciona, mas sem memória: não há sugestões, conjuntos nem preços.
            Corra <code>supabase/migrations/20260824140000_despensa.sql</code> no SQL Editor.
          </span>
        </p>
      )}

      {e.estado === 'sem-rede' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem ligação</span>
          <span>Não foi possível ler a ementa.</span>
          <button type="button" className="aviso-repor impresso" onClick={() => e.recarregar()}>
            Tentar outra vez
          </button>
        </p>
      )}
      {e.falhou && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor. O que está escrito continua aqui.</span>
          <button type="button" className="aviso-repor impresso"
            onClick={() => { e.limparFalha(); e.recarregar() }}>
            Tentar outra vez
          </button>
        </p>
      )}

      <main className="abertura-envelope">
        <div className="abertura abertura--ementa">
          <div className="pagina pagina--esquerda">
            <Tira
              inicio={inicio}
              hoje={hoje}
              jantarDe={e.jantarDe}
              pratos={e.pratos}
              aberto={aberto}
              aoAbrir={definirAberto}
              aoMarcar={e.marcarJantar}
              aoCriarPrato={e.criarPrato}
              aoAcrescentarIngrediente={e.acrescentarIngrediente}
              aoAlterarIngrediente={e.alterarIngrediente}
              aoApagarIngrediente={e.apagarIngrediente}
            />
          </div>

          <div className="lombada" aria-hidden="true" />

          <div className="pagina pagina--direita">
            <ListaCompras
              compras={e.compras}
              semana={chave}
              porComprar={e.porComprar}
              total={e.total}
              artigos={e.artigos}
              conjuntos={e.conjuntos}
              mostrarPrecos={mostrarPrecos && !e.semDespensa}
              podePrecos={!e.semDespensa}
              aoAlternar={e.alternarComprado}
              aoAlterar={e.alterarCompra}
              aoAcrescentar={e.acrescentarCompra}
              aoApagar={e.apagarCompra}
              aoAplicarConjunto={e.aplicarConjunto}
              aoMostrarPrecos={e.semDespensa ? () => {} : guardarMostrarPrecos}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
