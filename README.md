# Untrusted+

An 8-bit spin on Untrusted - a JavaScript puzzle game where players edit code within the game itself to solve levels.

## How it works

Players guide Dr. Eval through levels by finding and modifying editable sections of the level's JavaScript code, then re-executing it to change the game world.

## Architecture

The repo has two layers:

- **Next.js wrapper** (`/src/`) — serves the game; the root route redirects to the static game entry point
- **Legacy game engine** (`/untrusted/`) — vanilla JavaScript built via Makefile, with rot.js for rendering and CodeMirror for the in-game editor

## Prerequisites

- **Node.js** 22+ and **pnpm** 11 (`corepack enable` or `npm i -g pnpm`)
- **Java** (for `make release` — used by YUI Compressor during `pnpm build`)

## Development

```bash
pnpm dev        # Start Next.js dev server (turbopack)
pnpm build      # Build game engine, then Next.js app
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

To work on the game engine directly:

```bash
cd untrusted
make            # Unminified debug build
make release    # Minified production build (requires Java)
make runlocal   # Serve locally for testing
```

## Docker

A `Dockerfile` is included for containerised deployments. It uses a multi-stage build: a `builder` stage (requires `make` + Java) produces the game assets and Next.js standalone output, and a slim `runner` stage serves it.

```bash
docker build -t untrusted-plus .
docker run -p 3000:3000 untrusted-plus
```

## Commits & releases

This repo follows [Conventional Commits](https://www.conventionalcommits.org/) and uses [semantic-release](https://semantic-release.gitbook.io/) to publish versions automatically.

- Run `pnpm commit` for an interactive prompt (commitizen), or write the message by hand.
- A husky `commit-msg` hook runs commitlint and rejects non-conventional messages.
- Pushes to `main` trigger [`.github/workflows/release.yml`](.github/workflows/release.yml), which decides the next version from the commits, updates `CHANGELOG.md` and `package.json`, tags the commit, and publishes a GitHub Release.

| Commit type | Effect |
|-------------|--------|
| `feat: …` | Minor version bump |
| `fix: …` | Patch version bump |
| `…!: …` or `BREAKING CHANGE:` footer | Major version bump |
| `chore:`, `docs:`, `ci:`, `refactor:`, `test:`, `style:` | No release |
