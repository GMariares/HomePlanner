import { useState, type ReactNode } from 'react'
import { ISetaDir } from './Icones'

/**
 * Um módulo que abre.
 *
 * Fechado continua a dizer o essencial — o nome e a conta — e ocupa uma
 * linha. É para o que se consulta de vez em quando e não se quer a empurrar
 * o mês para fora do ecrã: o livro do mês, as regras dos fornecedores.
 *
 * O gesto é um só e é o cabeçalho inteiro, como manda a casa: um módulo
 * não se abre por um botãozinho ao canto.
 */
export function Dobra({ id, titulo, conta, abertaPorOmissao = false, children }: {
  id: string
  titulo: string
  conta: string
  abertaPorOmissao?: boolean
  children: ReactNode
}) {
  const [aberta, definirAberta] = useState(abertaPorOmissao)
  return (
    <section className="modulo" aria-labelledby={`${id}-titulo`}>
      <header className="dia-cabeca dobra-cabeca">
        <h3 id={`${id}-titulo`} className="dia-nome dobra-nome">
          <button
            type="button"
            className="dobra-topo"
            aria-expanded={aberta}
            aria-controls={`${id}-corpo`}
            onClick={() => definirAberta(v => !v)}
          >
            <span className="dobra-seta" data-aberta={aberta || undefined} aria-hidden="true">
              <ISetaDir lado={13} />
            </span>
            {titulo}
          </button>
        </h3>
        <span className="dia-data modulo-numero">{conta}</span>
      </header>
      {aberta && <div id={`${id}-corpo`} className="dobra-corpo">{children}</div>}
    </section>
  )
}
