function mode(id, gameType, text, opts = {}) {
    return {
        id: `social_${id}`,
        gameType,
        category: opts.category ?? "social",
        text,
        choices: opts.choices,
        intensity: opts.intensity ?? "normal",
        ageRating: opts.ageRating ?? "all",
        difficulty: opts.difficulty ?? 1,
        minPlayers: opts.minPlayers ?? 2,
        tags: opts.tags ?? ["social", gameType],
        allowSkip: true,
        active: true,
    };
}
export const socialModePrompts = [
    mode("tat_01", "this_or_that", "Pick fast. No defending your answer.", {
        choices: ["Money", "Love"],
    }),
    mode("tat_02", "this_or_that", "Pick fast. No defending your answer.", {
        choices: ["Texting", "Calling"],
    }),
    mode("tat_03", "this_or_that", "Pick fast. No defending your answer.", {
        choices: ["Beach holiday", "Mountain trip"],
    }),
    mode("tat_04", "this_or_that", "Pick fast. No defending your answer.", {
        choices: ["Be famous", "Be anonymous and rich"],
    }),
    mode("tat_05", "this_or_that", "Pick fast. No defending your answer.", {
        choices: ["Know your future", "Change your past"],
    }),
    mode("ttl_01", "two_truths_and_a_lie", "Tell the group two true things and one lie about yourself. The group gets one guess.", { difficulty: 2 }),
    mode("ttl_02", "two_truths_and_a_lie", "Make your three statements about your university life. Keep the lie believable.", { difficulty: 2, tags: ["social", "university"] }),
    mode("ttl_03", "two_truths_and_a_lie", "Make your three statements about your dating history. The group votes on the lie.", { difficulty: 2, tags: ["social", "relationship"] }),
    mode("hot_01", "hot_seat", "Everyone gets one question: what is a hill you would die on?"),
    mode("hot_02", "hot_seat", "Everyone gets one question: what is your most chaotic student story?"),
    mode("hot_03", "hot_seat", "Everyone gets one question: what is something people always misunderstand about you?", { difficulty: 2 }),
    mode("hot_04", "hot_seat", "Everyone gets one question: who would you trust to plan your perfect night?", { tags: ["social", "relationship"] }),
];
//# sourceMappingURL=socialModes.js.map