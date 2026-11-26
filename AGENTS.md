# Repository rules

## Product

- This repository provides an OpenCode V2 plugin that caps chat-model context at 300,000 tokens.
- The plugin ID, package name, repository name, and user-facing name use `opencode-context-cap`.
- Keep the runtime dependency-free. OpenCode's model transform API provides the required behavior.
- Do not add provider-specific exceptions or increase a model's native context limit.

## Licensing and sources

- Repository code is MIT licensed.
- Code, dependencies, and assets may use only MIT, MIT-0, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Zlib,
  Unicode-3.0, CC0-1.0, or OFL-1.1 for fonts.
- Do not use copyleft licences of any strength, including GPL, LGPL, AGPL, MPL, EPL, or CC BY-SA. Do not use
  non-commercial, source-available, unlicensed, or unknown terms.
- Sources may use ordinary publisher or author copyright, CC BY, CC0, or public-domain terms. Ideas only may also
  come from share-alike, non-commercial, no-derivatives, or copyleft sources when no protected expression is copied.
- Do not use a source whose terms restrict applying what is learned in other software or products.
- OpenCode and other product names may appear descriptively for compatibility and installation instructions. Do not
  imply endorsement, affiliation, or ownership of another party's trademarks.

## Repository hygiene

- Keep generated archives, dependencies, local settings, temporary files, and Superpowers process documents out of
  version control.
- Public files must not contain machine-specific paths, credentials, private identities, or identifying logs.
- Documentation describes current behavior and supported installation. Git history records how it changed.
