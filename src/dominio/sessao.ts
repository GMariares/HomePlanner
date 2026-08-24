import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { configurado, esquemaAtrasado, supabase } from './supabase'
import type { Casa, Membro } from './tipos'

export type Sessao =
  | { fase: 'a-carregar' }
  | { fase: 'por-configurar' }
  | { fase: 'sem-migracao' }
  | { fase: 'sem-sessao' }
  | { fase: 'sem-casa'; email: string }
  | { fase: 'erro'; email: string; recado: string }
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

    /* Não conseguir ler não é o mesmo que não haver. Dizer "não tem casa" a
       quem tem manda a pessoa entrar noutra — e a base de dados, que sabe a
       verdade, recusa. Um erro é um erro e diz-se como tal. */
    if (error) {
      definir(esquemaAtrasado(error)
        ? { fase: 'sem-migracao' }
        : { fase: 'erro', email, recado: 'Não foi possível ler a que casa pertence.' })
      return
    }
    if (!membro) { definir({ fase: 'sem-casa', email }); return }

    // colunas estáveis primeiro: uma coluna nova não pode esconder a casa
    const { data: casa, error: erroCasa } = await supabase
      .from('casas')
      .select('*')
      .eq('id', membro.casa_id)
      .maybeSingle()

    if (erroCasa) {
      definir(esquemaAtrasado(erroCasa)
        ? { fase: 'sem-migracao' }
        : { fase: 'erro', email, recado: 'Não foi possível ler a casa.' })
      return
    }
    if (!casa) {
      definir({ fase: 'erro', email, recado: 'Pertence a uma casa que já não existe. Saia da casa para poder entrar noutra.' })
      return
    }

    definir({
      fase: 'pronto',
      casa: { ...(casa as Casa), mostrar_precos: Boolean((casa as { mostrar_precos?: boolean }).mostrar_precos) },
      membro: membro as Membro,
      email,
    })
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

  /** Sair da casa, não da conta: para se poder entrar noutra. */
  const sairDaCasa = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const id = data.session?.user.id
    if (!id) return
    await supabase.from('membros').delete().eq('utilizador_id', id)
    await resolver(data.session)
  }, [resolver])

  return { sessao, recarregar, sair, sairDaCasa }
}
