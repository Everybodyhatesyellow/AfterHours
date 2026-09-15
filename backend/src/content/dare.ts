import type { Prompt } from "../types/domain.js";

function d(
  id: string,
  category: string,
  text: string,
  opts: Partial<Prompt> = {}
): Prompt {
  return {
    id: `dare_${id}`,
    gameType: "dare",
    category,
    text,
    intensity: opts.intensity ?? "normal",
    ageRating: opts.ageRating ?? "all",
    difficulty: opts.difficulty ?? 1,
    minPlayers: opts.minPlayers ?? 2,
    tags: opts.tags ?? [category],
    allowSkip: true,
    active: true,
  };
}

export const darePrompts: Prompt[] = [
  // FUNNY
  d("f01", "funny", "Do your best impression of someone else in this room. Let them guess who."),
  d("f02", "funny", "Talk in an accent of the group's choosing until your next turn."),
  d("f03", "funny", "Let the group pick your walk-out song and strut across the room to it."),

  // SOCIAL
  d("s01", "social", "Let another player rename your contact in their phone for the rest of the party."),
  d("s02", "social", "Give yourself a ridiculous stage name and introduce yourself dramatically."),
  d("s03", "social", "Let the group pick your next three responses for the whole game."),

  // EMBARRASSING
  d("e01", "embarrassing", "Recreate your most-used selfie pose for the group.", { intensity: "bold" }),
  d("e02", "embarrassing", "Do your worst dance move for 10 seconds, no music.", { intensity: "bold" }),

  // FLIRTY (non-graphic, playful)
  d("fl01", "flirty", "Give someone in the room your best cheesy pickup line.", { tags: ["flirty"], intensity: "bold" }),
  d("fl02", "flirty", "Compliment the player to your left in the most dramatic way possible.", { tags: ["flirty"] }),

  // BOLD
  d("b01", "bold", "Let the group ask you one question. You have to answer honestly.", { intensity: "wild", difficulty: 2 }),
  d("b02", "bold", "Reveal the last person you texted and what the text said (paraphrased is fine).", { intensity: "wild", difficulty: 2 }),

  // GROUP
  d("g01", "group", "Everyone points at the person most likely to become famous. Majority wins.", { tags: ["group"] }),
  d("g02", "group", "The group decides your new nickname for the rest of the night.", { tags: ["group"] }),
];
