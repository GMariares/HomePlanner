# Deploy

## Vercel

O `vercel.json` declara framework, comando de build e pasta de saída, para o
primeiro deploy não depender de autodetecção. Notas sobre o que lá está, já que
JSON não leva comentários:

- **`/sw.js` com `must-revalidate`.** Esta aplicação traz um service worker para
  se poder ler a semana sem rede. Um service worker em cache prende quem volta a
  uma versão antiga: publica-se uma correcção e a família continua a ver a
  anterior, sem forma de perceber porquê.
- **`/assets/*` e `/fonts/*` imutáveis por um ano.** Os de `assets` trazem hash no
  nome; as fontes são estáveis e estão auto-alojadas.
- **Rewrite de tudo para `/index.html`.** O Vercel serve ficheiros estáticos antes
  de aplicar rewrites, por isso os assets, o manifesto e o service worker
  continuam a ser servidos como ficheiros.

Variáveis de ambiente: não é preciso configurar nenhuma. O `.env` está no
repositório e o Vite lê-o no build. A chave anon é pública por desenho — vai
dentro do bundle de qualquer maneira. Quem protege os dados é o Row-Level
Security da migração.

## Supabase, depois do primeiro deploy

Em **Authentication → URL Configuration**:

- **Site URL**: o domínio do Vercel.
- **Redirect URLs**: `https://<dominio>/**`.

Sem isto, os emails de confirmação mandam as pessoas para `localhost` e o registo
parece estar avariado.

## Base de dados

Correr uma vez, no SQL Editor do projecto:
`supabase/migrations/20260824120000_caderneta.sql`
