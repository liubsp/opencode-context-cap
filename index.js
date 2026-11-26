export const CONTEXT_CAP = 300_000

export function capModelContext(model) {
  if (model.type !== "chat") return
  model.limit.context = Math.min(model.limit.context, CONTEXT_CAP)
}

export default {
  id: "opencode-context-cap",
  async setup(context) {
    await context.model.transform((editor) => {
      for (const model of editor.list()) {
        editor.update(model.providerID, model.id, capModelContext)
      }
    })
  },
}
