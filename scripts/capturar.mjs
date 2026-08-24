/**
 * Captura as duas vistas para revisão.
 *
 * Não usa `fullPage: true`: nessa via o Chromium larga a emulação de toque a
 * meio da captura, as media queries `hover` deixam de corresponder e a imagem
 * mostra um estado que nenhum telemóvel vê. Em vez disso mede-se a altura do
 * documento, redimensiona-se a janela para essa altura e tira-se um retrato
 * normal — a emulação mantém-se do princípio ao fim.
 */
import { chromium } from 'playwright'

const ENDERECO = 'http://localhost:4179/'
const ALVOS = [
  { nome: 'desktop', width: 1440, height: 900 },
  { nome: 'mobile', width: 390, height: 844, mobile: true },
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

for (const alvo of ALVOS) {
  const abrir = (altura) =>
    browser.newContext({
      viewport: { width: alvo.width, height: altura },
      deviceScaleFactor: 2,
      isMobile: !!alvo.mobile,
      hasTouch: !!alvo.mobile,
      locale: 'pt-PT',
    })

  let ctx = await abrir(alvo.height)
  let pagina = await ctx.newPage()
  await pagina.goto(ENDERECO, { waitUntil: 'networkidle' })
  await pagina.evaluate(() => document.fonts.ready)
  const altura = await pagina.evaluate(() =>
    Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)),
  )
  await ctx.close()

  ctx = await abrir(Math.min(altura, 8000))
  pagina = await ctx.newPage()
  await pagina.goto(ENDERECO, { waitUntil: 'networkidle' })
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.waitForTimeout(600)

  // a captura só vale se o que ela mostra for o que o aparelho vê
  const emulacao = await pagina.evaluate(() => ({
    hover: matchMedia('(hover: hover)').matches ? 'hover' : 'none',
    ponteiro: matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
  }))
  const esperado = alvo.mobile ? 'none' : 'hover'
  if (emulacao.hover !== esperado) {
    throw new Error(`${alvo.nome}: emulação errada — hover=${emulacao.hover}, esperava ${esperado}`)
  }

  await pagina.screenshot({ path: `.impeccable/review/${alvo.nome}.png` })
  console.log(`${alvo.nome}: ${alvo.width}x${altura} css px, hover=${emulacao.hover}, pointer=${emulacao.ponteiro}`)
  await ctx.close()
}

await browser.close()
