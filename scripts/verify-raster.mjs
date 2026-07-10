import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const iconSizes = [16, 24, 32, 48, 64, 128, 192, 256, 512, 1024]
const logoWidths = [320, 640, 960, 1280, 1600]
const iconPrefixes = ["icon", "icon-bg", "icon-app", "icon-dark"]
const logoPrefixes = ["logo", "logo-bg", "logo-dark"]

run(process.execPath, [path.join(root, "scripts", "generate-raster.mjs")])
await verifyPngInventory("icons", iconPrefixes, iconSizes, true)
await verifyPngInventory("logos", logoPrefixes, logoWidths, false)
await verifyIco()
run("git", ["diff", "--exit-code", "--", "raster"])
console.log("Brand raster verification passed.")

async function verifyPngInventory(directory, prefixes, sizes, square) {
  const outputDir = path.join(root, "raster", directory)
  const expected = prefixes.flatMap((prefix) => sizes.map((size) => `${prefix}-${size}.png`))
  const allowed = new Set(directory === "icons" ? [...expected, "icon.ico"] : expected)
  const actual = await readdir(outputDir)
  assertSameSet(actual, allowed, `raster/${directory}`)

  for (const prefix of prefixes) {
    for (const size of sizes) {
      const file = path.join(outputDir, `${prefix}-${size}.png`)
      const metadata = await sharp(file).metadata()
      if (metadata.format !== "png" || metadata.width !== size) {
        throw new Error(`${path.relative(root, file)} has unexpected format or width`)
      }
      if (square && metadata.height !== size) {
        throw new Error(`${path.relative(root, file)} must be ${size}x${size}`)
      }
    }
  }
}

async function verifyIco() {
  const file = path.join(root, "raster", "icons", "icon.ico")
  const data = await readFile(file)
  if (data.length < 6 || data.readUInt16LE(0) !== 0 || data.readUInt16LE(2) !== 1) {
    throw new Error("raster/icons/icon.ico has an invalid ICO header")
  }
  if (data.readUInt16LE(4) !== 7) {
    throw new Error("raster/icons/icon.ico must contain 7 icon sizes")
  }
}

function assertSameSet(actual, expected, label) {
  const actualSet = new Set(actual)
  const missing = [...expected].filter((name) => !actualSet.has(name))
  const extra = actual.filter((name) => !expected.has(name))
  if (missing.length || extra.length) {
    throw new Error(`${label} inventory mismatch; missing=[${missing}], extra=[${extra}]`)
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`)
  }
}
