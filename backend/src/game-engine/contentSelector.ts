import type { GameType, Prompt, RoomState } from "../types/domain.js";
import { ALL_PROMPTS, queryPrompts } from "../content/index.js";

const RECENT_CATEGORY_WINDOW = 3; // avoid repeating a category within this many rounds

/**
 * Picks the next game type given the room's recent history so the same mode
 * doesn't fire round after round, weighted by the host's enabled categories.
 */
export function pickNextGameType(room: RoomState, candidates: GameType[]): GameType {
  const recent = room.categoryHistory.slice(-RECENT_CATEGORY_WINDOW);
  const fresh = candidates.filter((c) => !recent.includes(c));
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Picks the next prompt for a given game type, filtering out anything already
 * used in this room and respecting the room's vibe/intensity/age settings.
 */
export function selectPrompt(
  room: RoomState,
  gameType: GameType,
  customPool: Prompt[] = []
): Prompt | null {
  const maxAgeRating = room.settings.adultModeUnlocked ? "wild18" : "all";
  const combinedPool = [...ALL_PROMPTS, ...customPool];

  const candidates = queryPrompts(combinedPool, {
    gameTypes: [gameType],
    vibes: room.settings.vibes,
    maxAgeRating,
    excludeIds: new Set(room.usedPromptIds),
    minPlayers: Object.keys(room.players).length,
  });

  if (candidates.length === 0) {
    // Pool exhausted for this exact filter — widen by dropping the vibe
    // filter before giving up, so long sessions don't stall out.
    const widened = queryPrompts(combinedPool, {
      gameTypes: [gameType],
      maxAgeRating,
      excludeIds: new Set(room.usedPromptIds),
    });
    if (widened.length === 0) return null;
    return pickBalancedPrompt(room, widened);
  }

  return pickBalancedPrompt(room, candidates);
}

/**
 * Among valid candidates, prefer prompts whose difficulty doesn't pile onto
 * whichever player is about to receive them two rounds running.
 */
function pickBalancedPrompt(room: RoomState, candidates: Prompt[]): Prompt {
  const currentPlayer = room.currentPlayerId ? room.players[room.currentPlayerId] : null;

  if (currentPlayer && currentPlayer.lastDifficulty >= 2) {
    const gentler = candidates.filter((p) => p.difficulty === 1);
    if (gentler.length > 0) {
      return gentler[Math.floor(Math.random() * gentler.length)];
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Picks the next "active" player, balancing turn counts across the room so
 * nobody gets picked twice before everyone else has gone once.
 */
export function selectNextPlayer(room: RoomState): string | null {
  const connected = Object.values(room.players).filter((p) => p.connected);
  if (connected.length === 0) return null;

  const minTurns = Math.min(...connected.map((p) => p.turnsTaken));
  const eligible = connected.filter(
    (p) => p.turnsTaken === minTurns && p.id !== room.currentPlayerId
  );

  const pool = eligible.length > 0 ? eligible : connected;
  return pool[Math.floor(Math.random() * pool.length)].id;
}
