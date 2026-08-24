import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Sem configuração não há caderneta partilhada: a aplicação diz-o em vez de rebentar. */
export const configurado = Boolean(url && chave)

export const supabase = createClient(url ?? 'http://localhost', chave ?? 'sem-chave', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

/** A tabela ainda não existe: a migração não foi corrida. */
export const semTabelas = (erro: { code?: string } | null) =>
  erro?.code === '42P01' || erro?.code === 'PGRST205'
