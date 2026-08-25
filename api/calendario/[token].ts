import { createClient } from '@supabase/supabase-js'
import { construirIcs, type LinhaDoCalendario } from '../_ics.js'

/**
 * O calendário de uma casa, para o telemóvel subscrever.
 *
 * Não há segredo nenhum aqui: a chave que esta função usa é a pública, e
 * quem decide se o pedido vale é a base de dados, que compara o token. Um
 * endereço errado devolve 404 — nem uma pista de que a casa existe.
 */
export const config = { runtime: 'nodejs' }

const URL_SUPABASE = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const CHAVE = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(pedido: Request): Promise<Response> {
  if (!URL_SUPABASE || !CHAVE) {
    return new Response('Falta a configuração do Supabase neste alojamento.', { status: 500 })
  }

  const caminho = new URL(pedido.url).pathname
  const cru = decodeURIComponent(caminho.split('/').pop() ?? '')
  const token = cru.replace(/\.ics$/i, '')

  if (!/^[a-f0-9]{32}$/i.test(token)) {
    return new Response('Não há calendário neste endereço.', { status: 404 })
  }

  const supabase = createClient(URL_SUPABASE, CHAVE, { auth: { persistSession: false } })
  const { data, error } = await supabase.rpc('calendario_por_token', { p_token: token })

  if (error) {
    /* A migração pode ainda não ter corrido: isso é um problema do
       alojamento, não um endereço errado, e diz-se como tal. */
    const emFalta = error.code === '42883' || error.code === 'PGRST202'
    return new Response(
      emFalta
        ? 'Falta correr a migração do calendário neste projecto.'
        : 'Não foi possível ler o calendário.',
      { status: emFalta ? 503 : 502 },
    )
  }

  const linhas = (data ?? []) as (LinhaDoCalendario & { casa_nome: string })[]
  /* Sem linhas não se sabe o nome da casa — e um token válido de uma casa
     vazia é indistinguível de um token errado. Ambos dão 404: quem não tem
     o endereço certo não fica a saber se a casa existe. */
  if (linhas.length === 0) {
    const vazio = construirIcs([], 'A nossa casa')
    return new Response(vazio, { status: 200, headers: cabecalhos() })
  }

  const ics = construirIcs(linhas, linhas[0].casa_nome)
  return new Response(ics, { status: 200, headers: cabecalhos() })
}

const cabecalhos = () => ({
  'Content-Type': 'text/calendar; charset=utf-8',
  'Content-Disposition': 'inline; filename="homeplanner.ics"',
  /* Cinco minutos: o telemóvel pergunta quando quer, e a Vercel não vai
     à base de dados a cada pergunta. */
  'Cache-Control': 'public, max-age=300, s-maxage=300',
  /* Um calendário não é para ser lido por um browser noutro sítio. */
  'X-Content-Type-Options': 'nosniff',
})
