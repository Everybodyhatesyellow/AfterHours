// ---------------------------------------------------------------------------
// Content library — structured prompt data, not hardcoded into components.
// Each game mode file exports an array of Prompt objects. This index merges
// them and exposes query helpers used by the game engine's content selector.
// ---------------------------------------------------------------------------

import type {
  Prompt,
  GameType,
  Vibe,
  Intensity,
  AgeRating,
} from "../types/domain.js";

import { truthPrompts } from "./truth.js";
import { darePrompts } from "./dare.js";
import { neverHaveIEverPrompts } from "./neverHaveIEver.js";
import { mostLikelyToPrompts } from "./mostLikelyTo.js";
import { wouldYouRatherPrompts } from "./wouldYouRather.js";
import { adultPrompts } from "./adult.js";
import { miscPrompts } from "./misc.js";
import { universityPrompts } from "./university.js";
import { socialModePrompts } from "./socialModes.js";

export const ALL_PROMPTS: Prompt[] = [
  ...truthPrompts,
  ...darePrompts,
  ...neverHaveIEverPrompts,
  ...mostLikelyToPrompts,
  ...wouldYouRatherPrompts,
  ...adultPrompts,
  ...miscPrompts,
  ...universityPrompts,
  ...socialModePrompts,
];

// Custom/community prompts submitted at runtime live in memory per room
// (see game-engine/customContent.ts) and get merged in at query time.

export interface PromptQuery {
  gameTypes?: GameType[];
  vibes?: Vibe[];
  intensity?: Intensity;
  maxAgeRating?: AgeRating; // caller resolves whether adult content is allowed
  excludeIds?: Set<string>;
  minPlayers?: number;
}

const AGE_RANK: Record<AgeRating, number> = {
  all: 0,
  mild18: 1,
  bold18: 2,
  wild18: 3,
};

const VIBE_TO_TAGS: Record<Vibe, string[]> = {
  chaotic: ["funny", "chaotic", "random"],
  wild: ["bold", "wild", "embarrassing"],
  flirty: ["flirty", "relationship", "dating"],
  party: ["funny", "social", "group"],
  deep: ["deep", "confession"],
  competitive: ["competitive", "challenge"],
  adult: ["mild18", "bold18", "wild18"],
  mix: [], // matches everything
};

export function queryPrompts(pool: Prompt[], q: PromptQuery): Prompt[] {
  return pool.filter((p) => {
    if (!p.active) return false;
    if (q.gameTypes && !q.gameTypes.includes(p.gameType)) return false;
    if (q.excludeIds?.has(p.id)) return false;
    if (q.minPlayers && p.minPlayers > q.minPlayers) return false;

    const allowedAge = q.maxAgeRating ?? "all";
    if (AGE_RANK[p.ageRating] > AGE_RANK[allowedAge]) return false;

    if (q.vibes && q.vibes.length && !q.vibes.includes("mix")) {
      const acceptableTags = q.vibes.flatMap((v) => VIBE_TO_TAGS[v]);
      const matchesVibe =
        acceptableTags.length === 0 ||
        p.tags.some((t) => acceptableTags.includes(t)) ||
        acceptableTags.includes(p.category);
      if (!matchesVibe) return false;
    }

    return true;
  });
}

export function getPromptById(id: string): Prompt | undefined {
  return ALL_PROMPTS.find((p) => p.id === id);
}
