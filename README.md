# RhythmRoyale

Multiplayer music quiz: a party listens to Deezer previews and races to pick the right title or artist.

- **Client:** Angular 22 (standalone components, signals, OnPush, zoneless) with Angular Material 3, in `src/app`.
- **Server:** Node/Express + Socket.IO in `src/server`. It also serves the built client, so both run on one origin.
- **Shared:** types, limits and the typed Socket.IO event contract in `src/shared` (`models.ts`, `events.ts`).

Requires Node.js `^22.22.3 || ^24.15.0 || >=26`.

## Development

```bash
npm run start:all   # game server on :3000 + ng serve on :4200 (proxies /socket.io to :3000)
npm run stop:all
```

Open `http://localhost:4200/`.

## Architecture

- **The server is the source of truth.** Each party is an explicit state machine (`lobby → proposal →
  loading → countdown → round → reveal → roundOver → … → gameOver`, see `PartyPhase`). Every command
  checks the phase, all timed transitions go through one timer, and answers are checked and scored on
  the server. After every change each player gets a full `PartyState` snapshot.
- **Sessions:** joining returns a secret session token (stored in `sessionStorage`). The client sends it
  in the Socket.IO handshake, so every reconnect (network drop, reload) restores the session. Opening the
  same session in another tab disconnects the older tab. Disconnected players keep their place for 60 s.
- **Client:** `PartyService` holds the latest snapshot and sends commands, `GameService` derives the
  round view (timer, answers, music), and `NavigationService` keeps the URL in sync with the phase.
  Routes: `/`, `/join/:code` (invite link), `/party/:code`, `/party/:code/game`, `/party/:code/results`.
  Leaving the party screens (back button, Leave buttons) asks for confirmation.
- **Styling:** the Material theme and all component overrides live in `src/styles/material.scss`
  (`rr-*` classes); Bootstrap is only used for layout utilities.

## Tests

```bash
npm test             # Angular unit tests (Vitest)
npm run test:server  # game server unit + Socket.IO integration tests (Vitest)
npm run test:e2e     # Playwright end-to-end tests (starts the dev servers if needed; uses live Deezer)
```

## Build and deploy

```bash
npm run build:all    # client to dist/rhythm-royale, server to dist/server
npm run start:prod   # serves both on $PORT (default 3000)
```

On Render: build command `npm install && npm run build:all`, start command `npm run start:prod`.
All game state is in memory, so the server must run as a single instance; a restart ends running games.
