import type { Prompt } from "../types/domain.js";

function m(id: string, text: string, opts: Partial<Prompt> = {}): Prompt {
  return {
    id: `mlt_${id}`,
    gameType: "most_likely_to",
    category: opts.category ?? "social",
    text,
    intensity: opts.intensity ?? "normal",
    ageRating: opts.ageRating ?? "all",
    difficulty: 1,
    minPlayers: 3,
    tags: opts.tags ?? ["most_likely_to"],
    allowSkip: false,
    active: true,
  };
}

export const mostLikelyToPrompts: Prompt[] = [
  m("01", "Who is most likely to get married first?", { tags: ["relationship"] }),
  m("02", "Who is most likely to become famous?"),
  m("03", "Who is most likely to disappear from the group chat for three weeks?"),
  m("04", "Who is most likely to fall for the wrong person?", { tags: ["relationship"], intensity: "bold" }),
  m("05", "Who is most likely to become a millionaire?"),
  m("06", "Who is most likely to have a secret admirer?", { tags: ["relationship", "flirty"] }),
  m("07", "Who is most likely to start drama by accident?", { intensity: "bold" }),
  m("08", "Who is most likely to have the wildest dating life?", { tags: ["relationship"], intensity: "bold" }),
  m("09", "Who is most likely to text an ex at 2am?", { tags: ["relationship"], intensity: "wild" }),
  m("10", "Who is most likely to end up on a reality show?"),
  m("11", "Who is most likely to be the last one awake at every party?"),
  m("12", "Who is most likely to fall in love this semester?", { tags: ["relationship"] }),
];
