# OpenCode Context Cap

Keep every OpenCode chat model at or below a 300,000-token context window.

The plugin changes the effective context limit that OpenCode uses for its UI, context budgeting, and compaction. It
does not change the model provider's native limit.

## Install

Add the public Git package to the `plugins` array in your global OpenCode configuration at
`~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "git+https://github.com/liubsp/opencode-context-cap.git"
  ]
}
```

Append the entry if the file already has other plugins. OpenCode watches the configuration and reloads it after the
file is saved.

Requires OpenCode V2.2 or newer.

## Behavior

For each chat model, the plugin sets the effective context to the lower of:

- the model's native context limit
- 300,000 tokens

A model with a one-million-token native context appears as 300,000 in OpenCode. A model with a 200,000-token native
context remains at 200,000. Output limits, capabilities, pricing, request settings, and non-chat models are unchanged.

OpenCode reapplies the transform whenever providers or model catalogs refresh, so newly discovered models receive the
same cap without another configuration edit.

## Remove

Remove the Git package entry from the `plugins` array. OpenCode restores the catalog limits when it reloads the
configuration.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm test
npm run test:package
```

The package test creates a tarball, installs it in a temporary directory, imports the installed entrypoint, checks its
behavior, and removes the temporary files.

## License

[MIT](LICENSE). Copyright (c) 2026 OpenCode Context Cap contributors.
