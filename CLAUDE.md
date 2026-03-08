# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wa-multi-session** is a TypeScript library for managing multiple WhatsApp sessions simultaneously, built on top of [Baileys](https://github.com/WhiskeySockets/Baileys). It is published as an npm package (not a standalone app).

## Commands

```bash
npm run build    # Compile TypeScript → dist/
npm start        # Build and run dist/index.js
```

No test suite is configured. TypeScript compilation (`tsc`) serves as the primary validation step.

## Architecture

### Two-Layer Design

**High-level layer — `Whatsapp` class** ([src/Whatsapp/Whatsapp.ts](src/Whatsapp/Whatsapp.ts)):

- The primary public API consumers use
- Manages a `Map<sessionId, Session>` of active connections
- Accepts an `Adapter` instance for storage (required, no default)
- Supports event callbacks: `onConnecting`, `onConnected`, `onDisconnected`, `onQRUpdated`, `onPairingCode`, `onMessageReceived`, `onMessageUpdated`
- On construction, auto-loads existing sessions from the adapter (unless `autoLoad: false`)

**Low-level layer — socket functions** ([src/Socket/index.ts](src/Socket/index.ts)):

- Wraps Baileys' `makeWASocket` directly
- Used internally by the `Whatsapp` class

### Adapter Pattern for Storage

The `Adapter` abstract class ([src/Adapter/Adapter.ts](src/Adapter/Adapter.ts)) defines the storage interface. The only built-in implementation is `SqliteAdapter` ([src/Adapter/SqliteAdapter.ts](src/Adapter/SqliteAdapter.ts)), which stores credentials in a SQLite database (default path: `./wa_credentials/database.db`, WAL mode enabled).

To add a new storage backend (e.g., PostgreSQL), extend `Adapter` and implement its interface.

### Session Lifecycle

1. Consumer calls `startSession(sessionId, options)` or `startSessionWithPairingCode(sessionId, options)`
2. Baileys establishes a WebSocket connection to WhatsApp
3. Credentials are persisted via the `Adapter`
4. On reconnect, sessions are auto-loaded from storage by calling `load()` in the constructor

### Key Directories

| Path                             | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| [src/Whatsapp/](src/Whatsapp/)   | Core `Whatsapp` class — main API surface              |
| [src/Adapter/](src/Adapter/)     | Storage adapter interface + SQLite implementation     |
| [src/Socket/](src/Socket/)       | Low-level Baileys socket setup                        |
| [src/Store/](src/Store/)         | Auth state management (`useSQLiteAuthState`)          |
| [src/Types/](src/Types/)         | All TypeScript types/interfaces                       |
| [src/Utils/](src/Utils/)         | Helpers: phone→JID conversion, media saving, delays   |
| [src/Messaging/](src/Messaging/) | Message sending functions (used by `Whatsapp` class)  |
| [src/Defaults/](src/Defaults/)   | Constants (`CALLBACK_KEY`, `Messages`, `CREDENTIALS`) |

### Phone Number Handling

Phone numbers must be converted to JID format before sending. Use `phoneToJid()` from [src/Utils/phone-to-jid.ts](src/Utils/phone-to-jid.ts). Individual contacts use `@s.whatsapp.net`; groups use `@g.us`.

### TypeScript Config

- Target: ES6, Module: CommonJS
- Strict mode enabled, `esModuleInterop: true`
- Source: `./src`, Output: `./dist`
- Generates `.d.ts` declaration files for npm consumers

---

<!-- rtk-instructions v2 -->

# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:

```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)

```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)

```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)

```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)

```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)

```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)

```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)

```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)

```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)

```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands

```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category         | Commands                       | Typical Savings |
| ---------------- | ------------------------------ | --------------- |
| Tests            | vitest, playwright, cargo test | 90-99%          |
| Build            | next, tsc, lint, prettier      | 70-87%          |
| Git              | status, log, diff, add, commit | 59-80%          |
| GitHub           | gh pr, gh run, gh issue        | 26-87%          |
| Package Managers | pnpm, npm, npx                 | 70-90%          |
| Files            | ls, read, grep, find           | 60-75%          |
| Infrastructure   | docker, kubectl                | 85%             |
| Network          | curl, wget                     | 65-70%          |

Overall average: **60-90% token reduction** on common development operations.

<!-- /rtk-instructions -->
