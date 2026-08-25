import type { ReactElement, SVGProps } from 'react'

/**
 * Os desenhos das categorias — mesma gramática do resto da casa: 24×24,
 * traço 1.8, pontas redondas. Nenhum emoji.
 */
function I({ children, lado = 20, ...resto }: SVGProps<SVGSVGElement> & { lado?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={lado} height={lado} fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...resto}>
      {children}
    </svg>
  )
}

type P = SVGProps<SVGSVGElement> & { lado?: number }

export const ICesto2 = (p: P) => (
  <I {...p}><path d="M4.5 9.5h15l-1.5 10h-12Z" /><path d="M8.5 9.5 12 3.5l3.5 6" /><path d="M9.5 13v3.5M14.5 13v3.5" /></I>
)
export const ICasa2 = (p: P) => (
  <I {...p}><path d="M4 11.5 12 4.5l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></I>
)
export const IRaio = (p: P) => (
  <I {...p}><path d="M13 3.5 6.5 13.5h4.5l-1 7 7-10.5H12.5Z" /></I>
)
export const ICarro = (p: P) => (
  <I {...p}><path d="M4 15.5v-3l2-4.5h12l2 4.5v3" /><path d="M4 15.5h16v3h-3v-3M7 18.5v-3H4" /><path d="M6.5 12.5h11" /></I>
)
/* Um batimento, não uma cruz dentro de uma caixa: essa lê-se como o
   botão de acrescentar, que é exactamente o que não é. */
export const ICruz = (p: P) => (
  <I {...p}><path d="M3.5 12.5h4l2-4.5 3 9 2.5-6 1.5 1.5h4" /></I>
)
export const ILivro2 = (p: P) => (
  <I {...p}><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5Z" /><path d="M5 18V5.5" /><path d="M9.5 7.5h5.5" /></I>
)
export const ITalheres2 = (p: P) => (
  <I {...p}><path d="M7 3.5v6a2 2 0 0 0 4 0v-6" /><path d="M9 9.5v11" /><path d="M16.5 3.5c-1.7 1-2.5 3.2-2.5 5.5 0 1.7 1 2.5 2.5 2.5V20.5" /></I>
)
export const IBalao = (p: P) => (
  <I {...p}><path d="M12 3.5c3 0 5 2.4 5 5.5s-2.2 6-5 6-5-2.9-5-6 2-5.5 5-5.5Z" /><path d="M12 15v2" /><path d="M10.5 20.5c0-1.5 3-1.5 3-3" /></I>
)
export const ICamisola = (p: P) => (
  <I {...p}><path d="M9 4.5 5 6.5l1.5 4L8.5 10v9.5h7V10l2 .5 1.5-4L15 4.5" /><path d="M9 4.5a3 3 0 0 0 6 0" /></I>
)
export const IGota = (p: P) => (
  <I {...p}><path d="M12 3.5c3 4 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5 5-9Z" /></I>
)
export const IPata = (p: P) => (
  <I {...p}><ellipse cx="12" cy="15.5" rx="4.5" ry="3.8" /><ellipse cx="6.5" cy="10.5" rx="2" ry="2.5" /><ellipse cx="17.5" cy="10.5" rx="2" ry="2.5" /><ellipse cx="10" cy="6.5" rx="1.9" ry="2.4" /><ellipse cx="14" cy="6.5" rx="1.9" ry="2.4" /></I>
)
export const ISaco = (p: P) => (
  <I {...p}><path d="M6 8.5h12l1 11H5Z" /><path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" /></I>
)
export const IMoeda2 = (p: P) => (
  <I {...p}><circle cx="12" cy="12" r="8.5" /><path d="M15 9.2a3.8 3.8 0 1 0 0 5.6" /><path d="M8.5 10.8h4M8.5 13.2h4" /></I>
)

const MAPA: Record<string, (p: P) => ReactElement> = {
  cesto: ICesto2, casa: ICasa2, raio: IRaio, carro: ICarro, cruz: ICruz,
  livro: ILivro2, talheres: ITalheres2, balao: IBalao, camisola: ICamisola,
  gota: IGota, pata: IPata, saco: ISaco, moeda: IMoeda2,
}

/** As chaves que uma categoria pode escolher. */
export const ICONES_DE_CATEGORIA = Object.keys(MAPA)

export const iconeDeCategoria = (chave: string) => MAPA[chave] ?? ISaco
