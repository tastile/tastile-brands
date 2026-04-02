import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")

const BLACK = "#111111"
const WHITE = "#FFFFFF"
const BLUE = "#2563EB"
const WORDMARK_X_OFFSET = -24

const symbolPathLeft = "M48 0L304 0A48 48 0 0 1 352 48L352 304A48 48 0 0 1 304 352L48 352A48 48 0 0 1 0 304L0 48A48 48 0 0 1 48 0Z"
const symbolPathRight = "M432 192L496 192A48 48 0 0 1 544 240L544 496A48 48 0 0 1 496 544L240 544A48 48 0 0 1 192 496L192 432A48 48 0 0 1 240 384L304 384A80 80 0 0 0 384 304L384 240A48 48 0 0 1 432 192Z"

async function loadWordmarkPath() {
  const data = await readFile(path.join(root, "scripts", "wordmark-path.txt"), "utf8")
  return data.trim()
}

function splitWordmarkPath(wordmarkPath) {
  const subpaths = wordmarkPath.match(/M[^M]*/g) ?? [wordmarkPath]
  const startPattern = /^M\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s+([-+]?\d*\.?\d+(?:e[-+]?\d+)?)/i
  const starts = subpaths
    .map((pathData, index) => {
      const match = pathData.match(startPattern)
      if (!match) {
        return null
      }
      return { index, pathData, x: Number(match[1]), y: Number(match[2]) }
    })
    .filter((item) => item !== null)

  let dotIndex = -1
  for (const a of starts) {
    for (const b of starts) {
      if (a.index === b.index) {
        continue
      }
      const sameColumn = Math.abs(a.x - b.x) <= 30
      const clearVerticalGap = b.y - a.y >= 90
      if (sameColumn && clearVerticalGap) {
        dotIndex = a.index
        break
      }
    }
    if (dotIndex !== -1) {
      break
    }
  }

  if (dotIndex === -1) {
    return { basePath: wordmarkPath, dotPath: "" }
  }

  const basePath = subpaths.filter((_, index) => index !== dotIndex).join(" ")
  return { basePath, dotPath: subpaths[dotIndex] }
}

function iconSymbol(left, right, scale = "0.86") {
  return `  <g transform="translate(512.75 512.5) rotate(-45) scale(${scale}) translate(-272 -272)">
    <path d="${symbolPathLeft}" fill="${left}"/>
    <path d="${symbolPathRight}" fill="${right}"/>
  </g>`
}

function logoSymbolAndWordmark(left, right, textColor, wordmarkPath) {
  const { basePath, dotPath } = splitWordmarkPath(wordmarkPath)
  return `  <g transform="translate(40 40)">
    <g transform="translate(216 216) rotate(-45) scale(0.32) translate(-272 -272)">
      <path d="${symbolPathLeft}" fill="${left}"/>
      <path d="${symbolPathRight}" fill="${right}"/>
    </g>
    <path d="${basePath}" fill="${textColor}" transform="translate(${WORDMARK_X_OFFSET} 0)"/>
    <path d="${dotPath}" fill="${BLUE}" transform="translate(${WORDMARK_X_OFFSET} 0)"/>
  </g>`
}

async function writeSvg(relativePath, content) {
  await writeFile(path.join(root, relativePath), `${content}\n`, "utf8")
}

async function main() {
  const wordmarkPath = await loadWordmarkPath()

  await writeSvg(
    "svg/icons/icon.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
  <title id="title">Tastile icon</title>
  <desc id="desc">A horizontal icon using black and blue on transparent background.</desc>
${iconSymbol(BLACK, BLUE)}
</svg>`
  )

  await writeSvg(
    "svg/icons/icon-bg.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
  <title id="title">Tastile icon with white background</title>
  <desc id="desc">A horizontal icon using black and blue on white background.</desc>
  <rect width="1024" height="1024" fill="${WHITE}"/>
${iconSymbol(BLACK, BLUE)}
</svg>`
  )

  await writeSvg(
    "svg/icons/icon-dark.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
  <title id="title">Tastile icon for dark mode</title>
  <desc id="desc">A horizontal icon using inverted black and white with blue accent for dark mode.</desc>
${iconSymbol(WHITE, BLUE)}
</svg>`
  )

  await writeSvg(
    "svg/icons/icon-app.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
  <title id="title">Tastile app icon</title>
  <desc id="desc">A rounded-square app icon using black and blue on white background.</desc>
  <rect x="64" y="64" width="896" height="896" rx="208" ry="208" fill="${WHITE}"/>
${iconSymbol(BLACK, BLUE, "0.74")}
</svg>`
  )

  await writeSvg(
    "svg/icons/icon-grid.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
  <title id="title">Tastile icon outline guide</title>
  <desc id="desc">An outline guide showing radii circles, extended edge lines, and major dimensions.</desc>
  <defs>
    <marker id="dim-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10Z" fill="#4B5563"/>
    </marker>
  </defs>
  <rect width="1024" height="1024" fill="${WHITE}"/>
  <rect x="64" y="64" width="896" height="896" rx="208" ry="208" fill="none" stroke="#64748B" stroke-width="3"/>
  <line x1="512" y1="0" x2="512" y2="1024" stroke="#94A3B8" stroke-width="2" stroke-dasharray="10 8"/>
  <line x1="0" y1="512" x2="1024" y2="512" stroke="#94A3B8" stroke-width="2" stroke-dasharray="10 8"/>
  <g transform="translate(512.75 512.5) rotate(-45) scale(0.86) translate(-272 -272)">
    <path d="${symbolPathLeft}" fill="#E5E7EB"/>
    <path d="${symbolPathRight}" fill="#E5E7EB"/>
    <g fill="none" stroke-width="2.25">
      <g stroke="#334155">
        <line x1="-24" y1="0" x2="48" y2="0" opacity="0.2"/>
        <line x1="48" y1="0" x2="304" y2="0" opacity="0.92"/>
        <line x1="304" y1="0" x2="376" y2="0" opacity="0.2"/>

        <line x1="352" y1="-24" x2="352" y2="48" opacity="0.2"/>
        <line x1="352" y1="48" x2="352" y2="304" opacity="0.92"/>
        <line x1="352" y1="304" x2="352" y2="376" opacity="0.2"/>

        <line x1="0" y1="-24" x2="0" y2="48" opacity="0.2"/>
        <line x1="0" y1="48" x2="0" y2="304" opacity="0.92"/>
        <line x1="0" y1="304" x2="0" y2="376" opacity="0.2"/>

        <line x1="-24" y1="352" x2="48" y2="352" opacity="0.2"/>
        <line x1="48" y1="352" x2="304" y2="352" opacity="0.92"/>
        <line x1="304" y1="352" x2="376" y2="352" opacity="0.2"/>

        <line x1="360" y1="192" x2="432" y2="192" opacity="0.2"/>
        <line x1="432" y1="192" x2="496" y2="192" opacity="0.92"/>
        <line x1="496" y1="192" x2="568" y2="192" opacity="0.2"/>

        <line x1="544" y1="168" x2="544" y2="240" opacity="0.2"/>
        <line x1="544" y1="240" x2="544" y2="496" opacity="0.92"/>
        <line x1="544" y1="496" x2="544" y2="568" opacity="0.2"/>

        <line x1="192" y1="360" x2="192" y2="432" opacity="0.2"/>
        <line x1="192" y1="432" x2="192" y2="496" opacity="0.92"/>
        <line x1="192" y1="496" x2="192" y2="568" opacity="0.2"/>

        <line x1="240" y1="544" x2="496" y2="544" opacity="0.92"/>
        <line x1="168" y1="544" x2="240" y2="544" opacity="0.2"/>
        <line x1="496" y1="544" x2="568" y2="544" opacity="0.2"/>

        <line x1="168" y1="384" x2="240" y2="384" opacity="0.2"/>
        <line x1="240" y1="384" x2="304" y2="384" opacity="0.92"/>
        <line x1="304" y1="384" x2="376" y2="384" opacity="0.2"/>

        <line x1="384" y1="168" x2="384" y2="240" opacity="0.2"/>
        <line x1="384" y1="240" x2="384" y2="304" opacity="0.92"/>
        <line x1="384" y1="304" x2="384" y2="376" opacity="0.2"/>
      </g>
      <g stroke="#334155" opacity="0.92">
      <circle cx="48" cy="48" r="48"/>
      <circle cx="304" cy="48" r="48"/>
      <circle cx="304" cy="304" r="48"/>
      <circle cx="48" cy="304" r="48"/>
      <circle cx="432" cy="240" r="48"/>
      <circle cx="496" cy="240" r="48"/>
      <circle cx="496" cy="496" r="48"/>
      <circle cx="240" cy="496" r="48"/>
      <circle cx="240" cy="432" r="48"/>
      <circle cx="304" cy="304" r="80"/>
      <line x1="0" y1="-66" x2="352" y2="-66" marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)"/>
      <line x1="-66" y1="0" x2="-66" y2="352" marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)"/>
      <line x1="240" y1="610" x2="496" y2="610" marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)"/>
      <line x1="610" y1="240" x2="610" y2="496" marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)"/>
      </g>
    </g>
    <g fill="#334155" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600">
      <text x="150" y="-78">352</text>
      <text x="-102" y="186" transform="rotate(-90 -102 186)">352</text>
      <text x="352" y="642">256</text>
      <text x="628" y="388" transform="rotate(-90 628 388)">256</text>
      <text x="326" y="214">R80</text>
      <text x="512" y="216">R48</text>
    </g>
  </g>
</svg>`
  )

  await writeSvg(
    "svg/logos/logo.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512" role="img" aria-labelledby="title desc">
  <title id="title">Tastile logo</title>
  <desc id="desc">A horizontal logo with rounded wordmark path using black and blue on transparent background.</desc>
${logoSymbolAndWordmark(BLACK, BLUE, BLACK, wordmarkPath)}
</svg>`
  )

  await writeSvg(
    "svg/logos/logo-bg.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512" role="img" aria-labelledby="title desc">
  <title id="title">Tastile logo with white background</title>
  <desc id="desc">A horizontal logo with rounded wordmark path using black and blue on white background.</desc>
  <rect width="1600" height="512" fill="${WHITE}"/>
${logoSymbolAndWordmark(BLACK, BLUE, BLACK, wordmarkPath)}
</svg>`
  )

  await writeSvg(
    "svg/logos/logo-dark.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512" role="img" aria-labelledby="title desc">
  <title id="title">Tastile logo for dark mode</title>
  <desc id="desc">A horizontal logo with rounded wordmark path using inverted black and white with blue accent for dark mode.</desc>
${logoSymbolAndWordmark(WHITE, BLUE, WHITE, wordmarkPath)}
</svg>`
  )

  await writeSvg(
    "svg/logos/logo-grid.svg",
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 512" role="img" aria-labelledby="title desc">
  <title id="title">Tastile logo outline guide</title>
  <desc id="desc">A logo outline guide with icon construction lines and neutral wordmark references.</desc>
  <defs>
    <marker id="dim-arrow-logo" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10Z" fill="#4B5563"/>
    </marker>
  </defs>
  <rect width="1600" height="512" fill="${WHITE}"/>
  <line x1="256" y1="0" x2="256" y2="512" stroke="#94A3B8" stroke-width="2" stroke-dasharray="10 8"/>
  <line x1="0" y1="256" x2="1600" y2="256" stroke="#94A3B8" stroke-width="2" stroke-dasharray="10 8"/>
  <g transform="translate(40 40)">
    <g transform="translate(216 216) rotate(-45) scale(0.32) translate(-272 -272)">
      <path d="${symbolPathLeft}" fill="#E5E7EB"/>
      <path d="${symbolPathRight}" fill="#E5E7EB"/>
      <g fill="none" stroke-width="3.2" stroke="#334155">
        <line x1="-24" y1="0" x2="48" y2="0" opacity="0.2"/>
        <line x1="48" y1="0" x2="304" y2="0" opacity="0.92"/>
        <line x1="304" y1="0" x2="376" y2="0" opacity="0.2"/>
        <line x1="352" y1="-24" x2="352" y2="48" opacity="0.2"/>
        <line x1="352" y1="48" x2="352" y2="304" opacity="0.92"/>
        <line x1="352" y1="304" x2="352" y2="376" opacity="0.2"/>
        <line x1="0" y1="-24" x2="0" y2="48" opacity="0.2"/>
        <line x1="0" y1="48" x2="0" y2="304" opacity="0.92"/>
        <line x1="0" y1="304" x2="0" y2="376" opacity="0.2"/>
        <line x1="-24" y1="352" x2="48" y2="352" opacity="0.2"/>
        <line x1="48" y1="352" x2="304" y2="352" opacity="0.92"/>
        <line x1="304" y1="352" x2="376" y2="352" opacity="0.2"/>
        <line x1="360" y1="192" x2="432" y2="192" opacity="0.2"/>
        <line x1="432" y1="192" x2="496" y2="192" opacity="0.92"/>
        <line x1="496" y1="192" x2="568" y2="192" opacity="0.2"/>
        <line x1="544" y1="168" x2="544" y2="240" opacity="0.2"/>
        <line x1="544" y1="240" x2="544" y2="496" opacity="0.92"/>
        <line x1="544" y1="496" x2="544" y2="568" opacity="0.2"/>
        <line x1="192" y1="360" x2="192" y2="432" opacity="0.2"/>
        <line x1="192" y1="432" x2="192" y2="496" opacity="0.92"/>
        <line x1="192" y1="496" x2="192" y2="568" opacity="0.2"/>
        <line x1="240" y1="544" x2="496" y2="544" opacity="0.92"/>
        <line x1="168" y1="544" x2="240" y2="544" opacity="0.2"/>
        <line x1="496" y1="544" x2="568" y2="544" opacity="0.2"/>
        <line x1="168" y1="384" x2="240" y2="384" opacity="0.2"/>
        <line x1="240" y1="384" x2="304" y2="384" opacity="0.92"/>
        <line x1="304" y1="384" x2="376" y2="384" opacity="0.2"/>
        <line x1="384" y1="168" x2="384" y2="240" opacity="0.2"/>
        <line x1="384" y1="240" x2="384" y2="304" opacity="0.92"/>
        <line x1="384" y1="304" x2="384" y2="376" opacity="0.2"/>
      </g>
      <g fill="none" stroke="#334155" stroke-width="3.2" opacity="0.92">
        <circle cx="48" cy="48" r="48"/>
        <circle cx="304" cy="48" r="48"/>
        <circle cx="304" cy="304" r="48"/>
        <circle cx="48" cy="304" r="48"/>
        <circle cx="432" cy="240" r="48"/>
        <circle cx="496" cy="240" r="48"/>
        <circle cx="496" cy="496" r="48"/>
        <circle cx="240" cy="496" r="48"/>
        <circle cx="240" cy="432" r="48"/>
        <circle cx="304" cy="304" r="80"/>
        <line x1="0" y1="-66" x2="352" y2="-66" marker-start="url(#dim-arrow-logo)" marker-end="url(#dim-arrow-logo)"/>
        <line x1="-66" y1="0" x2="-66" y2="352" marker-start="url(#dim-arrow-logo)" marker-end="url(#dim-arrow-logo)"/>
      </g>
    </g>
    <path d="${wordmarkPath}" fill="#E5E7EB" transform="translate(${WORDMARK_X_OFFSET} 0)"/>
    <line x1="430" y1="126" x2="1560" y2="126" stroke="#94A3B8" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="430" y1="300" x2="1560" y2="300" stroke="#94A3B8" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="430" y1="160" x2="1560" y2="160" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6 6"/>
    <g fill="#334155" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600">
      <text x="1568" y="132">cap height</text>
      <text x="1568" y="306">baseline</text>
      <text x="1568" y="166">x-height guide</text>
    </g>
  </g>
</svg>`
  )

  console.log("Applied A01 master colors and rounded path wordmark")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
