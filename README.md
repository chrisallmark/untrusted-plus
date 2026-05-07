# Untrusted+

An 8-bit spin on Untrusted - a Javascript puzzle game where players edit code within the game itself to solve levels.

## How it works

Players guide Dr. Eval through levels by finding and modifying editable sections of the level's JavaScript code, then re-executing it to change the game world.

## Architecture

The repo has two layers:

- **Next.js wrapper** (`/src/`) — serves the game; the root route redirects to the static game entry point
- **Legacy game engine** (`/untrusted/`) — vanilla JavaScript built via Makefile, with rot.js for rendering and CodeMirror for the in-game editor

## Development

```bash
pnpm dev        # Start Next.js dev server
pnpm build      # Build game engine, then Next.js app
pnpm lint       # Run ESLint
```

To work on the game engine directly:

```bash
cd untrusted
make            # Unminified debug build
make release    # Minified production build (requires Java)
make runlocal   # Serve locally for testing
```
