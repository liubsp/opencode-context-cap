import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises"
import { homedir, tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
assert.ok(process.env.npm_execpath, "Run this check through npm run test:package")

function npm(args, cwd) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  })
  assert.equal(result.status, 0, result.stderr || result.error?.message)
  return result.stdout
}

const packed = JSON.parse(npm(["pack", "--ignore-scripts", "--json"], root))[0]
const archive = join(root, packed.filename)
const base = join(tmpdir(), "opencode")
await mkdir(base, { recursive: true })
const directory = await mkdtemp(join(base, "context-cap-package-"))

try {
  const paths = new Set(packed.files.map((file) => file.path))
  for (const required of ["index.js", "package.json", "README.md", "LICENSE"]) {
    assert.ok(paths.has(required), `package is missing ${required}`)
  }

  const privatePaths = [root, homedir()].flatMap((path) => [
    path,
    path.replaceAll("\\", "/"),
    pathToFileURL(path).href,
  ])
  for (const file of packed.files) {
    const text = (await readFile(join(root, file.path), "utf8")).toLowerCase()
    assert.ok(
      !privatePaths.some((path) => text.includes(path.toLowerCase())),
      `package contains a private path: ${file.path}`,
    )
  }

  npm(["install", "--prefix", directory, "--ignore-scripts", "--no-audit", "--no-fund", archive], directory)
  const installed = join(directory, "node_modules", "@liubsp", "opencode-context-cap", "index.js")
  const plugin = await import(pathToFileURL(installed).href)
  assert.equal(plugin.default.id, "opencode-context-cap")

  const model = {
    type: "chat",
    limit: { context: 1_000_000, output: 128_000 },
  }
  plugin.capModelContext(model)
  assert.equal(model.limit.context, 300_000)
} finally {
  await rm(directory, { recursive: true, force: true })
  await rm(archive, { force: true })
}
