// Helper keeps every entry consistent without repeating boilerplate.
function t(id, category, text, opts = {}) {
    return {
        id: `truth_${id}`,
        gameType: "truth",
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
export const truthPrompts = [
    // FUNNY
    t("f01", "funny", "What's the dumbest thing you've done to try to impress someone?"),
    t("f02", "funny", "What's the weirdest excuse you've ever given for being late?"),
    t("f03", "funny", "What's a lie you told your parents that somehow worked?"),
    t("f04", "funny", "What's the most unhinged thing you've googled this month?"),
    t("f05", "funny", "What's a nickname you hope nobody in this room finds out about?"),
    // EMBARRASSING
    t("e01", "embarrassing", "What's the most embarrassing thing someone has caught you doing?", { intensity: "bold", difficulty: 2 }),
    t("e02", "embarrassing", "What's a text you sent to the wrong person?", { intensity: "bold" }),
    t("e03", "embarrassing", "What's the most awkward thing that's happened to you on a night out?", { intensity: "bold" }),
    t("e04", "embarrassing", "What's your most embarrassing autocorrect fail?"),
    t("e05", "embarrassing", "What's something you did in front of a crush that still haunts you?", { intensity: "bold", tags: ["embarrassing", "relationship"] }),
    // DEEP
    t("d01", "deep", "What's something you pretend doesn't bother you but actually does?", { intensity: "bold", difficulty: 2 }),
    t("d02", "deep", "What's a fear you've never told anyone in this room?", { difficulty: 2 }),
    t("d03", "deep", "What's something you're genuinely proud of that you never talk about?"),
    t("d04", "deep", "What's a habit you're trying to break?"),
    t("d05", "deep", "What's something you needed to hear this year that nobody said to you?", { difficulty: 2 }),
    // RELATIONSHIP
    t("r01", "relationship", "What's your biggest dating red flag?", { tags: ["relationship", "dating"] }),
    t("r02", "relationship", "What's the worst text you've received from someone you were dating?", { tags: ["relationship", "dating"] }),
    t("r03", "relationship", "What's a dealbreaker for you that most people wouldn't expect?", { tags: ["relationship", "dating"] }),
    t("r04", "relationship", "What's the longest you've liked someone without telling them?", { tags: ["relationship", "dating"] }),
    t("r05", "relationship", "What's the worst pickup line anyone has used on you?", { tags: ["relationship", "flirty"] }),
    // FLIRTY (non-explicit, playful)
    t("fl01", "flirty", "Who in this room would you be most curious to go on one date with?", { tags: ["flirty", "dating"], difficulty: 2 }),
    t("fl02", "flirty", "What's the first thing you notice about someone you're attracted to?", { tags: ["flirty"] }),
    t("fl03", "flirty", "What's your go-to move when you're trying to flirt?", { tags: ["flirty"] }),
    t("fl04", "flirty", "Who here gives the best first-date energy?", { tags: ["flirty", "dating"], difficulty: 2 }),
    // BOLD
    t("b01", "bold", "What's something you've wanted to tell someone here but never did?", { intensity: "wild", difficulty: 3, tags: ["bold", "confession"] }),
    t("b02", "bold", "Who in this room do you think has a secret you don't know about?", { intensity: "wild", difficulty: 2 }),
    t("b03", "bold", "What's the boldest decision you've made in the last year?", { intensity: "bold" }),
    t("b04", "bold", "If you had to date someone in this room, who would it be and why?", { intensity: "wild", difficulty: 3, tags: ["bold", "flirty"] }),
];
//# sourceMappingURL=truth.js.map