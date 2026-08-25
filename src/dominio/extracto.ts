/**
 * Ler um extracto do banco.
 *
 * CSV é o que todos os bancos dão. XLSX lê-se sem dependência nenhuma: um
 * .xlsx é um zip de XML, e o browser já sabe descomprimir
 * (DecompressionStream). Escolheu-se este caminho de propósito — a
 * biblioteca habitual para xlsx tem avisos de segurança conhecidos no npm,
 * e não vale a pena trazer isso para dentro das contas de uma família.
 */

export type Grelha = string[][]

/* ---------------- CSV ---------------- */

/** Separador: o que aparecer mais vezes fora de aspas na primeira linha. */
function acharSeparador(texto: string): string {
  const primeira = texto.split(/\r?\n/)[0] ?? ''
  const candidatos = [';', ',', '\t', '|']
  let melhor = ';'
  let mais = -1
  for (const s of candidatos) {
    let conta = 0
    let dentro = false
    for (const ch of primeira) {
      if (ch === '"') dentro = !dentro
      else if (ch === s && !dentro) conta++
    }
    if (conta > mais) { mais = conta; melhor = s }
  }
  return melhor
}

export function lerCsv(texto: string): Grelha {
  const limpo = texto.replace(/^﻿/, '')
  const sep = acharSeparador(limpo)
  const linhas: Grelha = []
  let campo = ''
  let linha: string[] = []
  let dentro = false

  for (let i = 0; i < limpo.length; i++) {
    const ch = limpo[i]
    if (dentro) {
      if (ch === '"') {
        if (limpo[i + 1] === '"') { campo += '"'; i++ }
        else dentro = false
      } else campo += ch
      continue
    }
    if (ch === '"') { dentro = true; continue }
    if (ch === sep) { linha.push(campo); campo = ''; continue }
    if (ch === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; continue }
    if (ch === '\r') continue
    campo += ch
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha) }
  return linhas.filter(l => l.some(c => c.trim() !== ''))
}

/* ---------------- XLSX, sem dependências ---------------- */

const texto = (b: ArrayBuffer) => new TextDecoder('utf-8').decode(b)

async function inflar(dados: Uint8Array, metodo: number): Promise<ArrayBuffer> {
  if (metodo === 0) return dados.slice().buffer as ArrayBuffer
  if (metodo !== 8) throw new Error('compressão não suportada')
  const fluxo = new Blob([dados as BlobPart]).stream()
    .pipeThrough(new DecompressionStream('deflate-raw'))
  return await new Response(fluxo).arrayBuffer()
}

/** Lê o directório central de um zip e devolve as entradas que interessam. */
async function abrirZip(buf: ArrayBuffer): Promise<Map<string, ArrayBuffer>> {
  const v = new DataView(buf)
  const u8 = new Uint8Array(buf)
  // o End Of Central Directory anda no fim, depois de um comentário opcional
  let eocd = -1
  for (let i = buf.byteLength - 22; i >= 0 && i > buf.byteLength - 22 - 65536; i--) {
    if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('não parece um ficheiro .xlsx')

  const quantas = v.getUint16(eocd + 10, true)
  let p = v.getUint32(eocd + 16, true)
  const saida = new Map<string, ArrayBuffer>()

  for (let n = 0; n < quantas; n++) {
    if (v.getUint32(p, true) !== 0x02014b50) break
    const metodo = v.getUint16(p + 10, true)
    const tamComprimido = v.getUint32(p + 20, true)
    const nomeTam = v.getUint16(p + 28, true)
    const extraTam = v.getUint16(p + 30, true)
    const comentTam = v.getUint16(p + 32, true)
    const offset = v.getUint32(p + 42, true)
    const nome = texto(buf.slice(p + 46, p + 46 + nomeTam))
    p += 46 + nomeTam + extraTam + comentTam

    if (!/^xl\/(worksheets\/sheet1\.xml|sharedStrings\.xml)$/.test(nome)) continue

    // o cabeçalho local repete os tamanhos dos campos variáveis
    const lNomeTam = v.getUint16(offset + 26, true)
    const lExtraTam = v.getUint16(offset + 28, true)
    const inicio = offset + 30 + lNomeTam + lExtraTam
    saida.set(nome, await inflar(u8.subarray(inicio, inicio + tamComprimido), metodo))
  }
  return saida
}

const desescapar = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
   .replace(/&amp;/g, '&')

/** Da referência "BC12" para o índice de coluna, à base 0. */
function colunaDe(ref: string): number {
  const letras = /^([A-Z]+)/.exec(ref)?.[1] ?? 'A'
  let n = 0
  for (const c of letras) n = n * 26 + (c.charCodeAt(0) - 64)
  return n - 1
}

export async function lerXlsx(buf: ArrayBuffer): Promise<Grelha> {
  const partes = await abrirZip(buf)
  const folha = partes.get('xl/worksheets/sheet1.xml')
  if (!folha) throw new Error('o ficheiro não tem nenhuma folha legível')

  const partilhadas: string[] = []
  const sst = partes.get('xl/sharedStrings.xml')
  if (sst) {
    for (const si of texto(sst).split('<si>').slice(1)) {
      const pedacos = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(m => desescapar(m[1]))
      partilhadas.push(pedacos.join(''))
    }
  }

  const grelha: Grelha = []
  const xml = texto(folha)
  for (const linha of xml.split(/<row[ >]/).slice(1)) {
    const celulas: string[] = []
    for (const m of linha.matchAll(/<c([^>]*)>([\s\S]*?)<\/c>|<c([^>]*)\/>/g)) {
      const atributos = m[1] ?? m[3] ?? ''
      const corpo = m[2] ?? ''
      const ref = /r="([A-Z]+\d+)"/.exec(atributos)?.[1]
      const tipo = /t="([^"]+)"/.exec(atributos)?.[1]
      const bruto = /<v>([\s\S]*?)<\/v>/.exec(corpo)?.[1]
        ?? [...corpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => x[1]).join('')
      let valor = desescapar(bruto ?? '')
      if (tipo === 's') valor = partilhadas[Number(valor)] ?? ''
      const onde = ref ? colunaDe(ref) : celulas.length
      while (celulas.length < onde) celulas.push('')
      celulas[onde] = valor
    }
    if (celulas.some(c => c.trim() !== '')) grelha.push(celulas)
  }
  return grelha
}

export async function lerFicheiro(f: File): Promise<Grelha> {
  if (/\.xlsx$/i.test(f.name)) return lerXlsx(await f.arrayBuffer())
  if (/\.xls$/i.test(f.name)) {
    throw new Error('O .xls antigo não se lê aqui. Grave como .xlsx ou como CSV.')
  }
  return lerCsv(await f.text())
}

/* ---------------- adivinhar o mapa ---------------- */

export interface Mapa {
  data: number
  descricao: number
  valor: number
  /** Quando o banco separa débito e crédito em duas colunas. */
  credito?: number
  cabecalho: boolean
}

const PARECE_DATA = /^\s*\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}\s*$/
const PARECE_VALOR = /^\s*-?\(?\s*[\d.\s]*\d(?:[.,]\d{1,2})?\s*\)?\s*€?\s*$/

/** "12/03/2026" ou "2026-03-12" → "2026-03-12". */
export function lerData(cru: string): string | null {
  const s = (cru ?? '').trim()
  if (!s) return null
  // uma data de folha de cálculo é um número de dias desde 1900
  if (/^\d{5}$/.test(s)) {
    const d = new Date(Date.UTC(1899, 11, 30) + Number(s) * 86400000)
    return d.toISOString().slice(0, 10)
  }
  const m = /^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})$/.exec(s)
  if (!m) return null
  let [, a, b, c] = m
  if (a.length === 4) return `${a}-${b.padStart(2, '0')}-${c.padStart(2, '0')}`
  const ano = c.length === 2 ? `20${c}` : c
  return `${ano}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`
}

/** Um palpite pelo cabeçalho, e se não houver, pelo que as células parecem. */
export function adivinharMapa(g: Grelha): Mapa {
  const vazio: Mapa = { data: -1, descricao: -1, valor: -1, cabecalho: false }
  if (g.length === 0) return vazio

  const cabeca = g[0].map(c => c.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  const acha = (...ps: string[]) => cabeca.findIndex(c => ps.some(p => c.includes(p)))

  const porNome: Mapa = {
    data: acha('data', 'date'),
    descricao: acha('descri', 'movimento', 'detalhe', 'concept'),
    valor: acha('montante', 'valor', 'importancia', 'amount'),
    credito: -1,
    cabecalho: true,
  }
  const debito = acha('debito')
  const credito = acha('credito')
  if (porNome.valor === -1 && debito >= 0 && credito >= 0) {
    porNome.valor = debito
    porNome.credito = credito
  }
  if (porNome.data >= 0 && porNome.valor >= 0) {
    if (porNome.descricao === -1) porNome.descricao = porNome.data === 0 ? 1 : 0
    return porNome
  }

  /* Sem cabeçalho reconhecível, olha-se para os dados: a coluna que parece
     uma data em quase todas as linhas é a data, e assim por diante. */
  const amostra = g.slice(0, 12)
  const colunas = Math.max(...amostra.map(l => l.length))
  const quota = (i: number, re: RegExp) =>
    amostra.filter(l => re.test(l[i] ?? '')).length / amostra.length

  let data = -1; let valor = -1
  for (let i = 0; i < colunas; i++) {
    if (data === -1 && quota(i, PARECE_DATA) > 0.6) data = i
    else if (quota(i, PARECE_VALOR) > 0.6 && (g[0][i] ?? '').trim() !== '') valor = i
  }
  if (valor === -1) {
    for (let i = colunas - 1; i >= 0; i--) if (i !== data && quota(i, PARECE_VALOR) > 0.6) { valor = i; break }
  }
  let descricao = -1
  let maisLongo = 0
  for (let i = 0; i < colunas; i++) {
    if (i === data || i === valor) continue
    const medio = amostra.reduce((s, l) => s + (l[i] ?? '').length, 0) / amostra.length
    if (medio > maisLongo) { maisLongo = medio; descricao = i }
  }
  return { data, descricao, valor, credito: -1, cabecalho: lerData(g[0][data] ?? '') === null }
}
