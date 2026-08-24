import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Sem configuração não há caderneta partilhada: a aplicação diz-o em vez de rebentar. */
export const configurado = Boolean(url && chave)

export const supabase = createClient(url ?? 'http://localhost', chave ?? 'sem-chave', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

/**
 * A base de dados está atrás do código: falta uma tabela ou uma coluna que
 * uma migração cria. Acontece entre publicar e correr o SQL, e não pode ser
 * confundido com "esta conta não tem casa" — são coisas opostas.
 */
export const esquemaAtrasado = (erro: { code?: string; message?: string } | null) => {
  const c = erro?.code
  if (c === '42P01' || c === 'PGRST205') return true   // tabela em falta
  if (c === '42703' || c === 'PGRST204') return true   // coluna em falta
  return /could not find the (table|column)/i.test(erro?.message ?? '')
}

/** @deprecated usar esquemaAtrasado */
export const semTabelas = esquemaAtrasado
