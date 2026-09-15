function n(id, text, opts = {}) {
    return {
        id: `nhie_${id}`,
        gameType: "never_have_i_ever",
        category: opts.category ?? "social",
        text,
        intensity: opts.intensity ?? "normal",
        ageRating: opts.ageRating ?? "all",
        difficulty: 1,
        minPlayers: 3,
        tags: opts.tags ?? ["never_have_i_ever"],
        allowSkip: true,
        active: true,
    };
}
export const neverHaveIEverPrompts = [
    n("01", "Never have I ever had a crush on a friend's friend.", { tags: ["relationship"] }),
    n("02", "Never have I ever lied about why I couldn't go out."),
    n("03", "Never have I ever looked up someone's socials before meeting them."),
    n("04", "Never have I ever sent a text and immediately regretted it."),
    n("05", "Never have I ever pretended to like a gift.", { intensity: "chill" }),
    n("06", "Never have I ever flirted with someone I knew was trouble.", { tags: ["relationship", "flirty"], intensity: "bold" }),
    n("07", "Never have I ever shown up somewhere just because I knew someone would be there.", { tags: ["relationship"] }),
    n("08", "Never have I ever ghosted someone.", { intensity: "bold" }),
    n("09", "Never have I ever cried during a movie and denied it."),
    n("10", "Never have I ever had a group chat about someone in this room.", { intensity: "wild", ageRating: "all" }),
    n("11", "Never have I ever pretended to be busy to avoid plans."),
    n("12", "Never have I ever fallen for someone way too fast.", { tags: ["relationship"] }),
];
//# sourceMappingURL=neverHaveIEver.js.map