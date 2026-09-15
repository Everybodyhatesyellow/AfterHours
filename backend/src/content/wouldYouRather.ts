import type { Prompt } from "../types/domain.js";

function w(
  id: string,
  choices: [string, string],
  opts: Partial<Prompt> = {},
): Prompt {
  return {
    id: `wyr_${id}`,
    gameType: "would_you_rather",
    category: opts.category ?? "funny",
    text: "Pick one. No explaining yourself.",
    choices,
    intensity: opts.intensity ?? "normal",
    ageRating: opts.ageRating ?? "all",
    difficulty: 1,
    minPlayers: 2,
    tags: opts.tags ?? ["would_you_rather"],
    allowSkip: true,
    active: true,
  };
}

export const wouldYouRatherPrompts: Prompt[] = [
  w("01", ["Always be 10 minutes late", "Always be 20 minutes early"]),
  w("02", ["Send every text unedited", "Never text again"]),
  w(
    "03",
    ["Date someone with no sense of humor", "Date someone with no ambition"],
    { tags: ["relationship"] },
  ),
  w("04", ["Leak your search history", "Leak your camera roll"], {
    intensity: "bold",
  }),
  w(
    "05",
    ["Everyone knows your salary", "Everyone knows your dating history"],
    { tags: ["relationship"], intensity: "bold" },
  ),
  w(
    "06",
    [
      "Be the funniest person in every room",
      "Be the most attractive person in every room",
    ],
    { tags: ["flirty"] },
  ),
  w("07", ["Get back with an ex", "Stay single for two more years"], {
    tags: ["relationship"],
  }),
  w("08", [
    "Always know when someone is lying",
    "Always get away with your own lies",
  ]),
];
