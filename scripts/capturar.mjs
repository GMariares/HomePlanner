import { chromium } from 'playwright'
const alvos = [
  { nome: 'desktop', width: 1440, height: 900 },
  { nome: 'mobile', width: 390, height: 844, mobile: true },
]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const a of alvos) {
  const ctx = await browser.newContext({
    viewport: { width: a.width, height: a.height },
    deviceScaleFactor: 2,
    isMobile: !!a.mobile,
    hasTouch: !!a.mobile,
    locale: 'pt-PT',
  })
  const p = await ctx.newPage()
  await p.goto('http://localhost:4175/', { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(700)
  await p.screenshot({ path: `.impeccable/review/${a.nome}.png`, fullPage: true })
  await ctx.close()
}
await browser.close()
console.log('capturado')
