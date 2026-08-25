import { useState } from 'react'
import { ListaCompras } from './ListaCompras'
import { Tira } from './Tira'
import { useEmenta } from '../dominio/ementa'
import { supabase } from '../dominio/supabase'
import { chaveDaSemana, indiceDeHoje, inicioDaSemana, intervalo } from '../dominio/semana'
import type { Casa } from '../dominio/tipos'
import { ISetaEsq, ISetaDir } from './Icones'

export function Ementa({ casa }: { casa: Casa }) {
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
    <main className="pagina">
      <header className="pagina-cabeca">
        <div>
          <h2 className="pagina-titulo">Ementa e compras</h2>
          <p className="pagina-sub">{intervalo(inicio)}</p>
        </div>
        <nav className="semana-nav" aria-label="Semanas">
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(d => mover7(d, -1))}>
            <ISetaEsq lado={16} />
            <span className="sr-only">Semana anterior</span>
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(inicioDaSemana())} disabled={hoje >= 0}>
            Esta semana
          </button>
          <button type="button" className="semana-nav-botao" onClick={() => definirInicio(d => mover7(d, 1))}>
            <ISetaDir lado={16} />
            <span className="sr-only">Semana seguinte</span>
          </button>
        </nav>
      </header>

      {e.estado === 'a-carregar' && (
        <p className="faixa faixa--calma" role="status"><span>A abrir a ementa…</span></p>
      )}
      {e.estado === 'sem-migracao' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem tabelas</span>
          <span>
            Falta a segunda migração. Corra
            <code> supabase/migrations/20260824130000_ementa.sql </code>
            no SQL Editor do projecto e recarregue.
          </span>
        </p>
      )}
      {e.semDespensa && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Falta a terceira migração</span>
          <span>
            A lista funciona, mas sem memória: não há sugestões, conjuntos nem preços.
            Corra <code>supabase/migrations/20260824140000_despensa.sql</code> no SQL Editor.
          </span>
        </p>
      )}
      {e.estado === 'sem-rede' && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Sem ligação</span>
          <span>Não foi possível ler a ementa.</span>
          <button type="button" className="botao-texto" onClick={() => e.recarregar()}>
            Tentar outra vez
          </button>
        </p>
      )}
      {e.falhou && (
        <p className="faixa" role="status">
          <span className="faixa-marca">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor. O que está escrito continua aqui.</span>
          <button type="button" className="botao-texto"
            onClick={() => { e.limparFalha(); e.recarregar() }}>
            Tentar outra vez
          </button>
        </p>
      )}

      <div className="ementa-grelha">
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
    </main>
  )
}
