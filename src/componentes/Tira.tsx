import { useState } from 'react'
import { DIAS, curto, diaDaSemana } from '../dominio/semana'
import type { Entrada, Prato } from '../dominio/tipos'
import { Escrita } from './Escrita'
import { Reticencias } from './Icones'

/** Os ingredientes do prato escolhido, escritos na pauta, aqui mesmo. */
function PratoDoDia({ dia, data, jantar, pratos, aoMarcar, aoCriarPrato, aoAcrescentarIngrediente, aoAlterarIngrediente, aoApagarIngrediente }: {
  dia: number
  data: Date
  jantar: Entrada | null
  pratos: Prato[]
  aoMarcar: (prato: Prato | null, texto?: string) => void
  aoCriarPrato: (nome: string) => Promise<Prato | null>
  aoAcrescentarIngrediente: (pratoId: string, nome: string, quantidade: string | null) => void
  aoAlterarIngrediente: (id: string, mudanca: { nome?: string; quantidade?: string | null }) => void
  aoApagarIngrediente: (id: string) => void
}) {
  const [procura, definirProcura] = useState('')
  const [novoNome, definirNovoNome] = useState('')
  const [novaQtd, definirNovaQtd] = useState('')

  const prato = jantar?.pratoId ? pratos.find(p => p.id === jantar.pratoId) ?? null : null
  const encontrados = pratos.filter(p =>
    p.nome.toLocaleLowerCase('pt').includes(procura.toLocaleLowerCase('pt')),
  )
  const podeCriar = procura.trim() && !pratos.some(p => p.nome.toLocaleLowerCase('pt') === procura.trim().toLocaleLowerCase('pt'))

  const escolher = async (p: Prato) => { aoMarcar(p); definirProcura('') }
  const criar = async () => {
    const novo = await aoCriarPrato(procura.trim())
    if (novo) { aoMarcar(novo); definirProcura('') }
  }

  return (
    <section className="prato-do-dia" aria-label={`O jantar de ${DIAS[dia]}`}>
      <header className="dia-cabecalho">
        <h3 className="dia-nome dia-nome--lista">{DIAS[dia]}</h3>
        <span className="dia-data impresso">{curto(data)}</span>
      </header>

      {jantar?.texto ? (
        <p className="prato-escolhido">
          <span className="prato-nome">{jantar.texto}</span>
          <button type="button" className="botao-linha impresso" onClick={() => aoMarcar(null)}>
            Tirar este jantar
          </button>
        </p>
      ) : null}

      <div className="prato-procura">
        <label className="campo">
          <span className="impresso">{jantar?.texto ? 'Trocar por outro prato' : 'Que prato'}</span>
          <input
            className="campo-escrita"
            value={procura}
            onChange={e => definirProcura(e.target.value)}
            placeholder="escrever ou procurar no livro"
          />
        </label>

        {procura.trim() && (
          <ul className="livro">
            {encontrados.map(p => (
              <li key={p.id}>
                <button type="button" className="livro-linha" onClick={() => escolher(p)}>
                  <span>{p.nome}</span>
                  <span className="impresso">{p.ingredientes.length} ingredientes</span>
                </button>
              </li>
            ))}
            {podeCriar && (
              <li>
                <button type="button" className="livro-linha livro-linha--novo" onClick={criar}>
                  <span>Escrever “{procura.trim()}” no livro</span>
                  <span className="impresso">prato novo</span>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {prato && (
        <div className="ingredientes">
          <p className="impresso ingredientes-titulo">
            Ingredientes de {prato.nome} — vão para a lista
          </p>
          <div className="dia-corpo pauta margem">
            {prato.ingredientes.map(i => (
              <div className="linha linha--ingrediente" key={i.id}>
                <span className="linha-goteira" />
                <span className="linha-corpo">
                  <Escrita
                    valor={i.nome}
                    rotulo={`Ingrediente de ${prato.nome}`}
                    aoMudar={nome => aoAlterarIngrediente(i.id, { nome })}
                  />
                </span>
                <span className="linha-hora">
                  <input
                    className="escrita escrita--hora"
                    value={i.quantidade ?? ''}
                    placeholder="qt."
                    aria-label={`Quantidade de ${i.nome}`}
                    onChange={e => aoAlterarIngrediente(i.id, { quantidade: e.target.value })}
                  />
                </span>
                <span className="linha-accoes">
                  <button type="button" className="botao-nu" onClick={() => aoApagarIngrediente(i.id)}>
                    <span className="sr-only">Apagar {i.nome}</span>
                    <Reticencias />
                  </button>
                </span>
              </div>
            ))}

            <div className="linha linha--branco linha--ingrediente">
              <span className="linha-goteira" />
              <span className="linha-corpo">
                <Escrita
                  valor={novoNome}
                  rotulo={`Escrever um ingrediente de ${prato.nome}`}
                  aoMudar={definirNovoNome}
                  aoTerminar={() => {
                    if (!novoNome.trim()) return
                    aoAcrescentarIngrediente(prato.id, novoNome.trim(), novaQtd.trim() || null)
                    definirNovoNome(''); definirNovaQtd('')
                  }}
                />
              </span>
              <span className="linha-hora">
                <input
                  className="escrita escrita--hora"
                  value={novaQtd}
                  placeholder="qt."
                  aria-label="Quantidade do ingrediente novo"
                  onChange={e => definirNovaQtd(e.target.value)}
                />
              </span>
              <span className="linha-accoes" />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/** A tira: os sete jantares numa passagem de olhos. */
export function Tira({ inicio, hoje, jantarDe, pratos, aberto, aoAbrir, ...accoes }: {
  inicio: Date
  hoje: number
  jantarDe: (dia: number) => Entrada | null
  pratos: Prato[]
  aberto: number | null
  aoAbrir: (dia: number | null) => void
  aoMarcar: (dia: number, prato: Prato | null, texto?: string) => void
  aoCriarPrato: (nome: string) => Promise<Prato | null>
  aoAcrescentarIngrediente: (pratoId: string, nome: string, quantidade: string | null) => void
  aoAlterarIngrediente: (id: string, mudanca: { nome?: string; quantidade?: string | null }) => void
  aoApagarIngrediente: (id: string) => void
}) {
  return (
    <section className="tira-bloco" aria-labelledby="tira-titulo">
      <header className="dia-cabecalho">
        <h2 id="tira-titulo" className="dia-nome">Os jantares</h2>
        <span className="dia-data impresso">a semana toda</span>
      </header>

      <ol className="tira">
        {DIAS.map((nome, i) => {
          const jantar = jantarDe(i)
          return (
            <li key={i} className="tira-item">
              <button
                type="button"
                className="tira-celula"
                data-hoje={hoje === i || undefined}
                data-aberta={aberto === i || undefined}
                aria-expanded={aberto === i}
                onClick={() => aoAbrir(aberto === i ? null : i)}
              >
                {hoje === i && <span className="fita fita--tira" aria-hidden="true" />}
                <span className="tira-dia impresso">
                  {nome.slice(0, 3)} <span className="tira-data">{curto(diaDaSemana(inicio, i))}</span>
                </span>
                <span className="tira-prato" data-vazio={!jantar?.texto || undefined}>
                  {jantar?.texto || 'por decidir'}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {aberto !== null && (
        <PratoDoDia
          dia={aberto}
          data={diaDaSemana(inicio, aberto)}
          jantar={jantarDe(aberto)}
          pratos={pratos}
          aoMarcar={(p, t) => accoes.aoMarcar(aberto, p, t)}
          aoCriarPrato={accoes.aoCriarPrato}
          aoAcrescentarIngrediente={accoes.aoAcrescentarIngrediente}
          aoAlterarIngrediente={accoes.aoAlterarIngrediente}
          aoApagarIngrediente={accoes.aoApagarIngrediente}
        />
      )}
    </section>
  )
}
