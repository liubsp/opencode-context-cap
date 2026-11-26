import assert from "node:assert/strict"
import test from "node:test"

test("caps a chat model context without changing its output limit", async () => {
  const plugin = await import("../index.js").catch(() => ({}))
  const capModelContext = plugin.capModelContext ?? (() => {})
  const model = {
    type: "chat",
    limit: { context: 628_000, output: 128_000 },
  }

  capModelContext(model)

  assert.deepEqual(model.limit, { context: 300_000, output: 128_000 })
})

test("preserves a chat model context below the cap", async () => {
  const { capModelContext } = await import("../index.js")
  const model = {
    type: "chat",
    limit: { context: 200_000, output: 32_000 },
  }

  capModelContext(model)

  assert.equal(model.limit.context, 200_000)
})

test("does not cap a non-chat model", async () => {
  const { capModelContext } = await import("../index.js")
  const model = {
    type: "image",
    limit: { context: 500_000, output: 1 },
  }

  capModelContext(model)

  assert.equal(model.limit.context, 500_000)
})

test("caps a model discovered when OpenCode replays the transform", async () => {
  const module = await import("../index.js")
  const plugin = module.default ?? { async setup() {} }
  let transform
  const context = {
    model: {
      async transform(callback) {
        transform = callback
      },
    },
  }

  await plugin.setup(context)

  assert.equal(typeof transform, "function")
  const model = {
    providerID: "future-provider",
    id: "future-model",
    type: "chat",
    limit: { context: 1_000_000, output: 128_000 },
  }
  const editor = {
    list() {
      return [model]
    },
    update(providerID, modelID, update) {
      assert.equal(providerID, model.providerID)
      assert.equal(modelID, model.id)
      update(model)
    },
  }

  transform(editor)

  assert.equal(model.limit.context, 300_000)
})
