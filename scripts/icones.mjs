/**
 * Rasteriza public/favicon.svg nos tamanhos que o manifesto e o iOS pedem.
 * Origem de cada PNG: renderização directa de public/favicon.svg (autoria própria),
 * feita com Chromium via Playwright. Correr com `node scripts/icones.mjs`.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync('public/favicon.svg', 'utf8')
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const tamanho of [180, 192, 512]) {
  const ctx = await browser.newContext({ viewport: { width: tamanho, height: tamanho } })
  const p = await ctx.newPage()
  await p.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${tamanho}px;height:${tamanho}px}</style>${svg}`,
  )
  const buffer = await p.screenshot({ omitBackground: true })
  writeFileSync(`public/icone-${tamanho}.png`, buffer)
  await ctx.close()
}
await browser.close()
console.log('ícones gerados')
