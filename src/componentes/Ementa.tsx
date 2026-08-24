import { useState } from 'react'
import { Cabecalho } from './Cabecalho'
import { ListaCompras } from './ListaCompras'
import { Tira } from './Tira'
import { useEmenta } from '../dominio/ementa'
import { chaveDaSemana, indiceDeHoje, inicioDaSemana } from '../dominio/semana'
import type { Casa } from '../dominio/tipos'

export function Ementa({ casa, email, aoSair, aoTrocarDeVista }: {
  casa: Casa
  email: string
  aoSair: () => void
  aoTrocarDeVista: (v: 'semana' | 'ementa') => void
}) {
  const [inicio, definirInicio] = useState(() => inicioDaSemana())
  const [aberto, definirAberto] = useState<number | null>(null)
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
        vista="ementa"
        aoTrocarDeVista={aoTrocarDeVista}
      />

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
      {e.estado === 'sem-rede' && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Sem ligação</span>
          <span>Não foi possível ler a ementa. Verifique a rede.</span>
        </p>
      )}
      {e.falhou && (
        <p className="falha" role="status">
          <span className="falha-marca impresso">Não guardado</span>
          <span>Alguma coisa não chegou ao servidor.</span>
        </p>
      )}

      <main className="abertura-envelope">
        <div className="abertura abertura--ementa">
          <div className="pagina">
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
              aoAlternar={e.alternarComprado}
              aoAlterar={e.alterarCompra}
              aoAcrescentar={e.acrescentarCompra}
              aoApagar={e.apagarCompra}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
