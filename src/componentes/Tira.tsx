import { useState, type CSSProperties } from 'react'
import { DIAS, curto, diaDaSemana } from '../dominio/semana'
import type { Entrada, Prato } from '../dominio/tipos'
import { chaveDeNome } from '../dominio/adiar'
import { Escrita } from './Escrita'
import { useRascunho } from '../dominio/rascunho'
import { ILupa, IPontos, iconeDePrato } from './Icones'

/** Os ingredientes do prato escolhido, aqui mesmo, editáveis. */
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
  const [aEscrever, definirAEscrever] = useState(false)

  const guardarIngrediente = () => {
    if (!prato || !novoNome.trim()) return
    aoAcrescentarIngrediente(prato.id, novoNome.trim(), novaQtd.trim() || null)
    definirNovoNome(''); definirNovaQtd('')
  }
  const { linha: linhaNova, aoPerderFoco } = useRascunho(guardarIngrediente)

  const prato = jantar?.pratoId ? pratos.find(p => p.id === jantar.pratoId) ?? null : null
  const chave = chaveDeNome(procura)
  const todos = chave ? pratos.filter(p => chaveDeNome(p.nome).includes(chave)) : pratos
  // O livro inteiro não cabe aqui, nem precisa: escreve-se para ir buscar o resto.
  const TETO = 6
  const encontrados = todos.slice(0, TETO)
  const escondidos = todos.length - encontrados.length
  const podeCriar = chave.length > 0 && !pratos.some(p => chaveDeNome(p.nome) === chave)
  /* Com o jantar já marcado, o livro aberto por baixo empurrava os
     ingredientes um ecrã inteiro para baixo. Só abre a quem escrever. */
  const mostrarLivro = !!chave || (!jantar?.texto && pratos.length > 0)

  const escolher = (p: Prato) => { aoMarcar(p); definirProcura('') }
  /* Uma pizza à sexta não é um prato da casa: marca-se e não fica no livro. */
  const avulso = () => { aoMarcar(null, procura.trim()); definirProcura('') }
  const criar = async () => {
    if (aEscrever) return
    definirAEscrever(true)
    const novo = await aoCriarPrato(procura.trim())
    definirAEscrever(false)
    if (novo) { aoMarcar(novo); definirProcura('') }
  }

  const IconeDoDia = iconeDePrato(jantar?.texto ?? '')

  return (
    <div className="prato-do-dia" aria-label={`O jantar de ${DIAS[dia]}`}>
      <div className="dia-cabeca">
        <h4 className="dia-nome">{DIAS[dia]}</h4>
        <span className="dia-data">{curto(data)}</span>
      </div>

      {jantar?.texto ? (
        <div className="fila">
          <span className="tile" aria-hidden="true"><IconeDoDia /></span>
          <span className="fila-corpo">
            <span className="fila-nome prato-nome-grande">{jantar.texto}</span>
          </span>
          <button type="button" className="botao-texto" onClick={() => aoMarcar(null)}>
            Tirar este jantar
          </button>
        </div>
      ) : null}

      <label className="campo procura">
        <span className="sr-only">{jantar?.texto ? 'Trocar por outro prato' : 'Que prato vai ser'}</span>
        <span className="procura-icone"><ILupa lado={18} /></span>
        <input
          className="campo-escrita"
          value={procura}
          onChange={e => definirProcura(e.target.value)}
          placeholder={jantar?.texto ? 'trocar por outro prato…' : 'escrever ou procurar no livro…'}
          maxLength={80}
        />
      </label>

      {pratos.length === 0 && !procura.trim() && (
        <p className="vazio">
          O livro ainda está em branco. Escreva aqui o nome e o prato entra no livro.
        </p>
      )}

      {(mostrarLivro || podeCriar) && (
        <ul className="livro-lista">
          {encontrados.map(p => {
            const IconeP = iconeDePrato(p.nome)
            return (
              <li key={p.id}>
                <button type="button" className="livro-linha" onClick={() => escolher(p)}>
                  <span className="tile" aria-hidden="true"><IconeP /></span>
                  <span className="livro-linha-nome">{p.nome}</span>
                  <span className="livro-linha-meta">
                    {p.ingredientes.length === 1 ? '1 ingrediente' : `${p.ingredientes.length} ingredientes`}
                  </span>
                </button>
              </li>
            )
          })}
          {escondidos > 0 && (
            <li className="livro-mais">e mais {escondidos} — escreva para procurar</li>
          )}
          {podeCriar && (
            <>
              <li>
                <button type="button" className="livro-linha" onClick={avulso}>
                  <span className="livro-linha-nome">“{procura.trim()}” só nesta semana</span>
                  <span className="livro-linha-meta">sem entrar no livro</span>
                </button>
              </li>
              <li>
                <button type="button" className="livro-linha livro-linha--novo" onClick={criar} disabled={aEscrever}>
                  <span className="livro-linha-nome">{aEscrever ? 'Um momento…' : `Escrever “${procura.trim()}” no livro`}</span>
                  <span className="livro-linha-meta">prato novo, com ingredientes</span>
                </button>
              </li>
            </>
          )}
        </ul>
      )}

      {prato && (
        <div className="ingredientes">
          <p className="ingredientes-titulo">Ingredientes de {prato.nome} — vão para a lista</p>
          {prato.ingredientes.map(i => (
            <div className="fila" key={i.id}>
              <span className="fila-corpo">
                <Escrita
                  valor={i.nome}
                  rotulo={`Ingrediente de ${prato.nome}`}
                  aoMudar={nome => aoAlterarIngrediente(i.id, { nome })}
                />
              </span>
              <input
                className="escrita escrita--num"
                value={i.quantidade ?? ''}
                placeholder="qt."
                aria-label={`Quantidade de ${i.nome}`}
                onChange={e => aoAlterarIngrediente(i.id, { quantidade: e.target.value })}
              />
              <button type="button" className="botao-gelo" onClick={() => aoApagarIngrediente(i.id)}>
                <span className="sr-only">Apagar {i.nome}</span>
                <IPontos />
              </button>
            </div>
          ))}

          <div className="fila fila--branca" ref={linhaNova} onBlur={aoPerderFoco}>
            <span className="fila-corpo">
              <Escrita
                valor={novoNome}
                rotulo={`Escrever um ingrediente de ${prato.nome}`}
                aoMudar={definirNovoNome}
                aoConfirmar={guardarIngrediente}
              />
            </span>
            <input
              className="escrita escrita--num"
              value={novaQtd}
              placeholder="qt."
              aria-label="Quantidade do ingrediente novo"
              onChange={e => definirNovaQtd(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); guardarIngrediente() } }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/** Os jantares: sete pastilhas numa fila, o dia aberto por baixo. */
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
    <section
      className="modulo com-cor"
      style={{ '--cor': 'var(--c-ementa)' } as CSSProperties}
      aria-labelledby="tira-titulo"
    >
      <header className="dia-cabeca">
        <h3 id="tira-titulo" className="dia-nome">Os jantares</h3>
        <span className="dia-data">a semana toda</span>
      </header>

      <ol className="tira">
        {DIAS.map((nome, i) => {
          const jantar = jantarDe(i)
          return (
            <li key={i}>
              <button
                type="button"
                className="tira-celula"
                data-hoje={hoje === i || undefined}
                data-aberta={aberto === i || undefined}
                aria-expanded={aberto === i}
                onClick={() => aoAbrir(aberto === i ? null : i)}
              >
                <span className="tira-dia">
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
