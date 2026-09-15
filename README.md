# AFTERHOURS

> "Your friends. Your rules. Your chaos." — a late-night party game for groups
> that like a little push, a little chaos, and zero awkward setup.

This repo is a working product build: the architecture, content library,
game engine, socket protocol, and UI are all in place so you can run it
locally and extend it without rebuilding the foundation. It hasn’t been
validated against a live production server yet, so treat first boot as a
normal install-and-tweak pass rather than a guarantee of zero issues.

## Structure

```
afterhours/
  backend/     Node + Express + Socket.IO game server
  frontend/    React + TypeScript + Vite + Tailwind client
```

### Backend (`backend/src`)

- `types/domain.ts` — shared types (Player, RoomState, Prompt, etc.)
- `content/` — the structured prompt library (Truth, Dare, Never Have I
  Ever, Most Likely To, Would You Rather, 18+ Mild/Bold/Wild, polls, random
  events, mini-games). Nothing is hardcoded into UI components — every
  prompt is a typed object with category, intensity, age rating, tags, etc.,
  so adding thousands more later is a data problem, not a rewrite.
- `game-engine/`
  - `GameMode.ts` — the common interface every game mode implements
    (`getEligiblePlayers`, `generatePrompt`, `handleAnswer`,
    `handleCompletion`, `calculateScore`). New modes plug in without
    touching the engine or socket layer.
  - `contentSelector.ts` — smart selection: avoids repeating prompts,
    rotates game types, balances whose turn it is, and avoids stacking hard
    prompts on the same player twice in a row.
  - `scoring.ts` — point values, wild-dare bonus, streak bonuses.
  - `RoomEngine.ts` — the server-authoritative state machine for a single
    room (start, advance round, submit answer, complete round).
- `game-modes/basicModes.ts` — concrete implementations for Truth, Dare,
  Never Have I Ever, and the two voting modes (Most Likely To / Vote). Use
  this file as the template for Hot Seat, Confess or Challenge, 1v1, and the
  mini-games — the interface is set up so each mode can live on its own.
- `services/roomManager.ts` — in-memory room registry + room code
  generation. Swap for Redis if you need multi-instance horizontal scaling.
- `services/moderation.ts` — profanity filtering + an in-memory report
  queue (persist to the `reports` table in production).
- `socket/index.ts` — every realtime event the client sends and receives.
- `routes/admin.ts` — read-only stats/reports API for the admin dashboard.
  **Not authenticated by default** — mount `middleware/requireAdmin.ts` in
  front of it before deploying.

### Frontend (`frontend/src`)

- `pages/` — Landing, CreateParty (vibe + settings picker), JoinParty,
  Lobby, Game (the live round loop), Results (superlatives + final scores),
  AdminDashboard.
- `components/` — PromptCard, PlayerChip, VibeGrid, SegmentedControl,
  AgeGateModal, Timer, Button — all built from the same design tokens.
- `lib/socket.ts` — Socket.IO client wrapper with a promise-based
  `emitWithAck` helper matching the backend's ack-callback protocol.
  `lib/store.ts` — a small Zustand store holding the current room + player.
- `hooks/useRoomSync.ts` — subscribes any page to `room:state` /
  `round:result` broadcasts.
- Design tokens live in `tailwind.config.js`: a near-black base (`ink`,
  `surface`), coral/lilac/gold accents, Fraunces for display type and Sora
  for UI, with a darker, nightlife-leaning vibe that feels more like a
  late-night social app than a template.

## Running locally

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev                # http://localhost:4000

# Frontend, in a second terminal
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Open two browser windows against `localhost:5173` to simulate a host and a
guest — create a room in one, join with the code in the other.

## Session storage

All room state, player names, scores, prompt history, and moderation reports
are held in memory for the lifetime of the Node process. Restarting the server
clears active sessions by design; there is no database setup or migration.
The room manager also sweeps abandoned sessions periodically so memory stays
bounded.

## What's implemented vs. what's next

**Fully implemented:** room creation/joining, one-phone pass-and-play with
named players, lobby with ready states, the 18+ age-gate flow, the round
loop for Truth/Dare/Never Have I Ever/Most-Likely-To/Vote, scoring + streaks,
results/superlatives, an admin stats+reports API, the full content library,
and the realtime game flow.

**Planned extension points:** Hot Seat, Confess or Challenge, Roast Round,
Who Knows Who, 1v1, mini-games, random events, and custom-question approval.
Each has data types and/or content already defined (see `content/misc.ts` for
random events and mini-game metadata) — implement them as new `GameMode`
classes in `game-modes/` following the pattern in `basicModes.ts`, then
register them in `RoomEngine.ts`'s `CATEGORY_ROTATION` and the `modes` map.

## Deployment notes

- **Backend**: any Node host that supports WebSockets (Render, Railway, Fly,
  a plain VPS). Set `CLIENT_ORIGIN` to your deployed frontend's URL.
- **Frontend**: any static host (Vercel, Netlify, Cloudflare Pages). Set
  `VITE_SERVER_URL` to your deployed backend's URL at build time.
- Never commit `.env` files — both `.env.example` files list what's needed.
