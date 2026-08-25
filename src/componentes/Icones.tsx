import type { SVGProps } from 'react'

/**
 * O sistema de ícones da casa: desenhados aqui, num traço só (1.8, pontas
 * redondas), 24×24. Nenhum emoji, nenhuma biblioteca — o desenho é da casa.
 */
function Icone({ children, lado = 20, ...resto }: SVGProps<SVGSVGElement> & { lado?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={lado}
      height={lado}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...resto}
    >
      {children}
    </svg>
  )
}

/* ---- navegação ---- */
export const ICasa = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4 11.5 12 4.5l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></Icone>
)
export const ICalendario = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><rect x="4" y="5.5" width="16" height="14.5" rx="3" /><path d="M4 10.5h16" /><path d="M8.5 3.5v3.5M15.5 3.5v3.5" /><path d="M8.5 14.5h2" /></Icone>
)
export const ITalheres = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M7 3.5v6a2 2 0 0 0 4 0v-6" /><path d="M9 9.5v11" /><path d="M16.5 3.5c-1.7 1-2.5 3.2-2.5 5.5 0 1.7 1 2.5 2.5 2.5V20.5" /></Icone>
)
export const ILivro = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5Z" /><path d="M5 18V5.5" /><path d="M19 18v3H7.5" /><path d="M9.5 7.5h5.5" /></Icone>
)
export const IMoeda = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><circle cx="12" cy="12" r="8.5" /><path d="M15 9.2a3.8 3.8 0 1 0 0 5.6" /><path d="M8.5 10.8h4M8.5 13.2h4" /></Icone>
)

/* ---- acções ---- */
export const ICesto = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4.5 9.5h15l-1.5 10h-12Z" /><path d="M8.5 9.5 12 3.5l3.5 6" /><path d="M9.5 13v3.5M14.5 13v3.5" /></Icone>
)
export const ILupa = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><circle cx="10.5" cy="10.5" r="6" /><path d="m15.5 15.5 4.5 4.5" /></Icone>
)
export const IMais = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M12 5.5v13M5.5 12h13" /></Icone>
)
export const ISetaEsq = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="m14.5 5.5-6.5 6.5 6.5 6.5" /></Icone>
)
export const ISetaDir = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="m9.5 5.5 6.5 6.5-6.5 6.5" /></Icone>
)
export const IVisto = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="m5.5 12.5 4 4 9-9" /></Icone>
)
export const IPontos = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p} fill="currentColor" stroke="none"><circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" /></Icone>
)
export const IPessoa = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></Icone>
)
export const ISair = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M14 4.5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7" /><path d="m16 8.5 3.5 3.5-3.5 3.5" /><path d="M19.5 12H10" /></Icone>
)
export const IRelogio = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Icone>
)
export const ISetaMudanca = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p} lado={p.lado ?? 14}><path d="M5 12h12" /><path d="m13.5 8.5 3.5 3.5-3.5 3.5" /></Icone>
)

/* ---- a comida, desenhada: o azulejo de um prato escolhe daqui ---- */
export const IPanela = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M5.5 10.5h13v5a4 4 0 0 1-4 4h-5a4 4 0 0 1-4-4Z" /><path d="M3.5 10.5h17" /><path d="M9 7.5c0-1.2 1-1.3 1-2.5M13.5 7.5c0-1.2 1-1.3 1-2.5" /></Icone>
)
export const IPeixe = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4 12c2.5-3.5 6-5 9.5-5 2.5 0 4.5 2 6 5-1.5 3-3.5 5-6 5C10 17 6.5 15.5 4 12Z" /><path d="M13.5 7 16 4.5" /><path d="M13.5 17 16 19.5" /><circle cx="16.5" cy="11" r="0.3" fill="currentColor" /></Icone>
)
export const IBife = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4.5 13.5c0-4 3.5-7 8-7s7 2 7 5-2.5 5-6 5c-2 0-2.5-1-4.5-1s-4.5 0-4.5-2Z" /><path d="M8.5 12.5c0-1.5 1.5-2.5 3-2.5" /></Icone>
)
export const IMassa = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4.5 13.5h15a7.5 7.5 0 0 1-15 0Z" /><path d="M6 10.5c4-2 8-2 12 0M7.5 7.5c3-1.5 6-1.5 9 0" /></Icone>
)
export const ISopa = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4.5 12.5h15a7.5 7.5 0 0 1-15 0Z" /><path d="m14 9.5 4.5-4.5" /></Icone>
)
export const IFolha = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M18.5 5.5c-8 0-13 4-13 10.5 0 1.5.5 2.5.5 2.5s5.5 1 9.5-3 3-10 3-10Z" /><path d="M6.5 17.5c2-4.5 5-7.5 8.5-9" /></Icone>
)
export const IBolo = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M5 12.5h14v6.5H5Z" /><path d="M5 15c1.5 1.2 3 .2 4.5 0s3 1.2 4.5 0 3-.2 4.5 0" transform="translate(0 -1.2)" /><path d="M12 9.5v3M12 6.5v.5" /></Icone>
)
export const IPao = (p: SVGProps<SVGSVGElement> & { lado?: number }) => (
  <Icone {...p}><path d="M4.5 13c0-3.5 3.5-6 7.5-6s7.5 2.5 7.5 6c0 1.5-1 2.5-2.5 2.5v3.5h-10V15.5C5.5 15.5 4.5 14.5 4.5 13Z" /><path d="M10 10.5c-.5 1-.5 2 0 3M14 10.5c-.5 1-.5 2 0 3" transform="translate(0 -0.5)" /></Icone>
)

/** O azulejo de um prato: escolhe o desenho pelas palavras do nome. */
export function iconeDePrato(nome: string) {
  const n = nome.toLocaleLowerCase('pt')
  if (/peixe|bacalhau|salm|atum|polvo|lulas|sardinha|dourada|robalo|pescada|marisco|camar/.test(n)) return IPeixe
  if (/sopa|caldo|creme de/.test(n)) return ISopa
  if (/massa|esparguete|lasanha|noodles|macarr/.test(n)) return IMassa
  if (/salada|legumes|vegetariano|vegan|tofu|gr[aã]o|feij[aã]o/.test(n)) return IFolha
  if (/bolo|sobremesa|doce|tarte|mousse|pudim/.test(n)) return IBolo
  if (/p[aã]o|pizza|tosta|sandes|hamb/.test(n)) return IPao
  if (/carne|bife|frango|porco|vaca|vitela|borrego|costeleta|febras|picanha|peru|coelho/.test(n)) return IBife
  return IPanela
}
