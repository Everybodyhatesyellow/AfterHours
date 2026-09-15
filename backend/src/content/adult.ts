import type { Prompt, AgeRating } from "../types/domain.js";

// All adult content is flirty / suggestive / confession-based. Nothing here
// is graphic or sexually explicit — see PHASE 10 rules in the product spec.
function a(
  id: string,
  ageRating: AgeRating,
  gameType: "truth" | "dare",
  text: string,
  opts: Partial<Prompt> = {}
): Prompt {
  return {
    id: `adult_${id}`,
    gameType,
    category: `18+_${ageRating}`,
    text,
    intensity: ageRating === "wild18" ? "wild" : ageRating === "bold18" ? "bold" : "normal",
    ageRating,
    difficulty: ageRating === "wild18" ? 3 : ageRating === "bold18" ? 2 : 1,
    minPlayers: 2,
    tags: opts.tags ?? ["adult", "flirty", "relationship"],
    allowSkip: true,
    active: true,
  };
}

export const adultPrompts: Prompt[] = [
  // 18+ MILD
  a("m01", "mild18", "truth", "What's your biggest dating red flag?"),
  a("m02", "mild18", "truth", "What's the most attractive quality someone can have?"),
  a("m03", "mild18", "truth", "Have you ever had a crush on someone you definitely shouldn't have?"),
  a("m04", "mild18", "truth", "What's your worst first-date experience?"),
  a("m05", "mild18", "truth", "Who in this room has the best flirting skills?"),
  a("m06", "mild18", "dare", "Give someone in the room your best flirtatious compliment."),
  a("m07", "mild18", "dare", "Maintain eye contact with another player for 15 seconds. First to laugh loses."),

  // 18+ BOLD
  a("b01", "bold18", "truth", "Who here would you most likely go on a date with?"),
  a("b02", "bold18", "truth", "What's the boldest move you've made on someone you liked?"),
  a("b03", "bold18", "truth", "Have you ever flirted with someone just because you were bored?"),
  a("b04", "bold18", "truth", "What's something that instantly makes someone more attractive to you?"),
  a("b05", "bold18", "truth", "What's your biggest weakness when you're attracted to someone?"),
  a("b06", "bold18", "truth", "Who in the room would be the most dangerous person to date?"),
  a("b07", "bold18", "dare", "Deliver your best pickup line to someone chosen by the group."),
  a("b08", "bold18", "dare", "Describe your ideal date in 20 seconds, out loud."),

  // 18+ WILD
  a("w01", "wild18", "truth", "Reveal your most unexpected crush, past or present."),
  a("w02", "wild18", "truth", "Who here would you trust to set you up on a date?"),
  a("w03", "wild18", "truth", "What's the most awkward romantic situation you've ever been in?"),
  a("w04", "wild18", "truth", "Which player would you absolutely not date, and why?"),
  a("w05", "wild18", "truth", "Who has the most attractive personality in this room?"),
  a("w06", "wild18", "truth", "What's the closest you've come to making a terrible romantic decision?"),
  a("w07", "wild18", "dare", "Let the group decide which player would make your best fictional movie love interest."),
  a("w08", "wild18", "dare", "Give a player a dramatic, movie-style confession — as over the top as possible."),
];
