import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import pngToIco from "png-to-ico"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")
const svgIconsDir = path.join(root, "svg", "icons")
const svgLogosDir = path.join(root, "svg", "logos")
const rasterIconsDir = path.join(root, "raster", "icons")
const rasterLogosDir = path.join(root, "raster", "logos")

const iconSizes = [16, 24, 32, 48, 64, 128, 192, 256, 512, 1024]
const logoWidths = [320, 640, 960, 1280, 1600]

const iconSources = [
  { file: "icon.svg", prefix: "icon" },
  { file: "icon-bg.svg", prefix: "icon-bg" },
  { file: "icon-app.svg", prefix: "icon-app" },
  { file: "icon-dark.svg", prefix: "icon-dark" }
]

const logoSources = [
  { file: "logo.svg", prefix: "logo" },
  { file: "logo-bg.svg", prefix: "logo-bg" },
  { file: "logo-dark.svg", prefix: "logo-dark" }
]

async function ensureOutput() {
  await mkdir(rasterIconsDir, { recursive: true })
  await mkdir(rasterLogosDir, { recursive: true })
}

async function renderIcons() {
  const icoSourcePngs = []
  for (const source of iconSources) {
    const svgPath = path.join(svgIconsDir, source.file)
    const svgBuffer = await readFile(svgPath)
    for (const size of iconSizes) {
      const outPath = path.join(rasterIconsDir, `${source.prefix}-${size}.png`)
      await sharp(svgBuffer).resize(size, size).png().toFile(outPath)
      if (source.prefix === "icon" && [16, 24, 32, 48, 64, 128, 256].includes(size)) {
        icoSourcePngs.push(outPath)
      }
    }
  }
  const icoBuffer = await pngToIco(icoSourcePngs)
  await writeFile(path.join(rasterIconsDir, "icon.ico"), icoBuffer)
}

async function renderLogos() {
  for (const source of logoSources) {
    const svgPath = path.join(svgLogosDir, source.file)
    const svgBuffer = await readFile(svgPath)
    for (const width of logoWidths) {
      const outPath = path.join(rasterLogosDir, `${source.prefix}-${width}.png`)
      await sharp(svgBuffer).resize({ width }).png().toFile(outPath)
    }
  }
}

async function main() {
  await ensureOutput()
  await renderIcons()
  await renderLogos()
  console.log(`Generated raster assets in ${path.join(root, "raster")}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
