export const BASE_POINTS = {
    truth: 10,
    dare: 20,
    never_have_i_ever: 5,
    most_likely_to: 5,
    who_would_you_date: 5,
    vote: 5,
    hot_seat: 15,
    confess_or_challenge: 15,
    group_challenge: 15,
    one_v_one: 25,
    mini_game: 25,
};
const WILD_DARE_BONUS = 10; // dare intensity "wild" -> +30 total, matches spec
const STREAK_BONUS = 10;
const STREAK_MILESTONES = [3, 5, 10];
export function pointsForCompletion(gameType, intensity, player, doubled = false) {
    let points = BASE_POINTS[gameType] ?? 10;
    if (gameType === "dare" && intensity === "wild") {
        points += WILD_DARE_BONUS;
    }
    let reason = `${gameType.replace(/_/g, " ")} completed`;
    const nextStreak = player.streak + 1;
    if (STREAK_MILESTONES.includes(nextStreak)) {
        points += STREAK_BONUS;
        reason += ` (${nextStreak} streak bonus)`;
    }
    if (doubled) {
        points *= 2;
        reason += " — double points event";
    }
    return { playerId: player.id, points, reason };
}
export function pointsForSkip() {
    // Skipping never awards or removes points — the player is never punished
    // for opting out (see SAFETY section of the product spec).
    return null;
}
//# sourceMappingURL=scoring.js.map