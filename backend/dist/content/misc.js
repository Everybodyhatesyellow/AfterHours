// Anonymous-question starters for Hot Seat (players can also submit their own
// at runtime — these seed the pool so a fresh room isn't empty).
export const hotSeatStarters = [
    "Who was your last crush?",
    "Who here would you trust with a secret?",
    "What's something nobody in this room knows about you?",
    "What's the last lie you told?",
    "What's a rumor about you that's actually true?",
];
// Rapid-fire poll prompts for FRIEND GROUP VOTING.
export const votePrompts = [
    "Best dressed?",
    "Most attractive personality?",
    "Funniest?",
    "Most likely to become rich?",
    "Most likely to ghost someone?",
    "Most likely to get into trouble tonight?",
    "Most trustworthy?",
    "Most likely to become famous?",
].map((text, i) => ({
    id: `vote_${String(i + 1).padStart(2, "0")}`,
    gameType: "vote",
    category: "poll",
    text,
    intensity: "normal",
    ageRating: "all",
    difficulty: 1,
    minPlayers: 3,
    tags: ["vote", "poll"],
    allowSkip: false,
    active: true,
}));
export const randomEvents = [
    { type: "chaos_round", label: "CHAOS ROUND", description: "Everyone gets a random challenge, all at once." },
    { type: "double_points", label: "DOUBLE POINTS", description: "The next round is worth 2x points." },
    { type: "revenge", label: "REVENGE", description: "The previous round's winner picks the next player." },
    { type: "everyone_answers", label: "EVERYONE", description: "Everyone answers the next prompt." },
    { type: "switch", label: "SWITCH", description: "Turn order gets shuffled." },
    { type: "hot_seat_blitz", label: "HOT SEAT", description: "A random player takes rapid-fire questions." },
    { type: "battle", label: "BATTLE", description: "Two random players face off; the room votes a winner." },
];
export const miniGames = [
    { type: "fastest_finger", label: "FASTEST FINGER", description: "A button appears at random. First tap wins." },
    { type: "guess_the_player", label: "GUESS THE PLAYER", description: "Clues appear about someone in the room — guess who." },
    { type: "category_race", label: "CATEGORY RACE", description: "Name something in the category before anyone else." },
    { type: "two_truths_and_a_lie", label: "TWO TRUTHS AND A LIE", description: "One player submits three statements; the room guesses the lie." },
    { type: "who_knows_me", label: "WHO KNOWS ME?", description: "One player answers privately; everyone predicts their answer." },
];
// Placeholder export kept for the content index's flat merge — vote prompts
// live in their own array above (gameType "vote") but the game engine also
// merges them into the general pool for content-selection bookkeeping.
export const miscPrompts = [...votePrompts];
//# sourceMappingURL=misc.js.map