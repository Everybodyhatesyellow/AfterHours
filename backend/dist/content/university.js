function campus(id, gameType, text, opts = {}) {
    return {
        id: `campus_${id}`,
        gameType,
        category: "university",
        text,
        intensity: opts.intensity ?? "normal",
        ageRating: opts.ageRating ?? "all",
        difficulty: opts.difficulty ?? 1,
        minPlayers: opts.minPlayers ?? 2,
        tags: opts.tags ?? ["university", "student", "social"],
        allowSkip: opts.allowSkip ?? true,
        active: true,
        choices: opts.choices,
    };
}
export const universityPrompts = [
    campus("truth_01", "truth", "What's the most confident thing you've said in a lecture while having no idea what was happening?"),
    campus("truth_02", "truth", "What's the most questionable meal you've made because your budget was finished?"),
    campus("truth_03", "truth", "Have you ever attended a class mainly because someone attractive was there?", { tags: ["university", "student", "relationship"] }),
    campus("truth_04", "truth", "What's the wildest excuse you've used to escape a group assignment?"),
    campus("dare_01", "dare", "Give a dramatic two-minute speech defending the worst meal you've cooked in student housing."),
    campus("dare_02", "dare", "Let the group rename you with a fake degree for the next three rounds."),
    campus("mlt_01", "most_likely_to", "Who is most likely to become the unofficial leader of a group project?", { minPlayers: 3, allowSkip: false }),
    campus("mlt_02", "most_likely_to", "Who is most likely to accidentally sleep through their own exam?", { minPlayers: 3, allowSkip: false }),
];
//# sourceMappingURL=university.js.map