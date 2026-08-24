import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { configurado, semTabelas, supabase } from './supabase'
import type { Casa, Membro } from './tipos'

export type Sessao =
  | { fase: 'a-carregar' }
  | { fase: 'por-configurar' }
  | { fase: 'sem-migracao' }
  | { fase: 'sem-sessao' }
  | { fase: 'sem-casa'; email: string }
  | { fase: 'pronto'; casa: Casa; membro: Membro; email: string }

export function useSessao() {
  const [sessao, definir] = useState<Sessao>(() =>
    configurado ? { fase: 'a-carregar' } : { fase: 'por-configurar' },
  )

  const resolver = useCallback(async (s: Session | null) => {
    if (!s?.user) { definir({ fase: 'sem-sessao' }); return }
    const email = s.user.email ?? ''

    const { data: membro, error } = await supabase
      .from('membros')
      .select('id, casa_id, utilizador_id, papel')
      .eq('utilizador_id', s.user.id)
      .maybeSingle()

    if (error) { definir(semTabelas(error) ? { fase: 'sem-migracao' } : { fase: 'sem-casa', email }); return }
    if (!membro) { definir({ fase: 'sem-casa', email }); return }

    const { data: casa, error: erroCasa } = await supabase
      .from('casas')
      .select('id, nome, codigo')
      .eq('id', membro.casa_id)
      .maybeSingle()

    if (erroCasa || !casa) { definir({ fase: 'sem-casa', email }); return }
    definir({ fase: 'pronto', casa: casa as Casa, membro: membro as Membro, email })
  }, [])

  useEffect(() => {
    if (!configurado) return
    let vivo = true
    supabase.auth.getSession().then(({ data }) => { if (vivo) resolver(data.session) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (vivo) resolver(s) })
    return () => { vivo = false; sub.subscription.unsubscribe() }
  }, [resolver])

  const recarregar = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    await resolver(data.session)
  }, [resolver])

  const sair = useCallback(async () => {
    await supabase.auth.signOut()
    try { localStorage.removeItem('homeplanner:casa') } catch { /* sem persistência */ }
  }, [])

  return { sessao, recarregar, sair }
}
