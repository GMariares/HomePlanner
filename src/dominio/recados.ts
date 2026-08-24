/** O que o Supabase diz, dito em português e a apontar a saída. */
const MAPA: [RegExp, string][] = [
  [/invalid login credentials/i, 'Email ou palavra-passe errados.'],
  [/email not confirmed/i, 'Falta confirmar o email. Veja a caixa de entrada — a mensagem tem um link.'],
  [/user already registered|already been registered/i, 'Já existe uma conta com este email. Experimente entrar.'],
  [/password should be at least (\d+)/i, 'A palavra-passe é curta demais: precisa de pelo menos 6 caracteres.'],
  [/unable to validate email|invalid format/i, 'Esse email não parece um email.'],
  [/for security purposes|after \d+ seconds/i, 'Ainda agora foi enviada uma. Espere um pouco antes de pedir outra.'],
  [/email rate limit exceeded/i, 'O serviço de email do projecto atingiu o limite. Tente daqui a uma hora, ou desligue a confirmação por email nas definições do Supabase.'],
  [/rate limit|too many requests/i, 'Demasiadas tentativas seguidas. Espere um pouco.'],
  [/já pertence a uma casa/i, 'Já pertence a uma casa.'],
  [/não há nenhuma casa com esse código/i, 'Não há nenhuma casa com esse código. Confirme as seis letras.'],
  [/failed to fetch|network/i, 'Sem ligação. Verifique a rede e tente outra vez.'],
]

export function recado(erro: unknown, alternativa = 'Não resultou. Tente outra vez.'): string {
  const texto = erro instanceof Error ? erro.message : String((erro as { message?: string })?.message ?? erro ?? '')
  for (const [padrao, dito] of MAPA) if (padrao.test(texto)) return dito
  return texto && texto.length < 120 ? texto : alternativa
}
