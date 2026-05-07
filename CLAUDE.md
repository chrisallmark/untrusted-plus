# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Untrusted — The Continuing Adventures of Dr. Eval" is a meta-JavaScript puzzle game where players edit JavaScript code within the game to solve levels. The repo has two layers:

- **Next.js wrapper** (`/src/`) — minimal; just redirects `/` to the static game
- **Legacy game engine** (`/untrusted/`) — vanilla JavaScript (~10+ years old), built via Makefile

## Commands

```bash
# Development
pnpm dev              # Next.js dev server (turbopack)
pnpm lint             # ESLint

# Production
pnpm build            # Builds untrusted game, then Next.js app
pnpm start            # Start production server

# Game engine (run inside /untrusted/)
make                  # Build unminified debug version → scripts/build/untrusted.js
make release          # Build minified production version (requires Java for YUI Compressor)
make clean            # Remove built scripts
make runlocal         # Serve game locally for testing
```

`pnpm build` runs `pnpm untrusted` first, which triggers `make release` and copies output to `public/untrusted/`.

## Architecture

### Next.js Layer (`/src/app/`)

Essentially a passthrough:
- `layout.tsx` — root HTML shell
- `page.tsx` — client-side redirect to `/untrusted/index.html`

### Game Engine (`/untrusted/scripts/`)

Global-scope, concatenation-based (no module system). Build order in the Makefile matters. Key files:

| File | Role |
|---|---|
| `game.js` | Main controller, level loading, game state |
| `map.js` | Level grid, object placement, rendering |
| `player.js` | Player movement, inventory, interactions |
| `objects.js` | Game object definitions |
| `dynamicObject.js` | Objects with timed/interval behaviour |
| `display.js` | Rendering via rot.js |
| `codeEditor.js` | In-game code editor (CodeMirror), enforces editable regions |
| `validate.js` | Prevents editing engine scripts; whitelists level files only |
| `ui.js` | UI management |
| `sound.js` | Audio tracks |
| `reference.js` | Player-facing API documentation |

### Levels (`/untrusted/levels/`)

Files use a `.jsx` extension but are **not React JSX** — it's a custom format. Each level exports two functions (`startLevel(map)` and optionally `onExit(map)`) plus a `#BEGIN_PROPERTIES#` block.

Editable section markers:
- `#BEGIN_EDITABLE#` / `#END_EDITABLE#` — full-line editable block
- `#{#` / `#}#` — inline editable region

The build process compiles all level files into `levels.js`.

### Mods (`/untrusted/mods/`)

Custom level sets can be built with `make mod=example_mod`. The `default` symlink points to `../levels/`.

## Key Constraints

- **No environment variables required** — the project has no `.env` files or external service dependencies.
- **Java required for production builds** — YUI Compressor is used for minification (`make release`).
- **Script concatenation order is significant** — don't reorder entries in the Makefile.
- **The `.jsx` level files are not React** — do not apply JSX/TSX tooling to them.
- **Editable markers are a core game mechanic** — preserve `#BEGIN_EDITABLE#` / `#END_EDITABLE#` / `#{#` / `#}#` markers exactly when editing level files.
