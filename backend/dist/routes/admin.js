import { Router } from "express";
import { ALL_PROMPTS } from "../content/index.js";
import { listReports } from "../services/moderation.js";
// NOTE: this router has no auth middleware wired up yet — in production,
// mount `requireAdmin` (see middleware/requireAdmin.ts) in front of every
// route below before deploying.
const router = Router();
router.get("/prompts", (req, res) => {
    const { gameType, ageRating, active } = req.query;
    let results = ALL_PROMPTS;
    if (gameType)
        results = results.filter((p) => p.gameType === gameType);
    if (ageRating)
        results = results.filter((p) => p.ageRating === ageRating);
    if (active !== undefined)
        results = results.filter((p) => p.active === (active === "true"));
    res.json({ count: results.length, prompts: results });
});
router.get("/reports", (_req, res) => {
    res.json({ reports: listReports() });
});
router.get("/stats", (_req, res) => {
    // Stats are intentionally limited to the current in-memory content pool.
    res.json({
        promptCount: ALL_PROMPTS.length,
        byGameType: ALL_PROMPTS.reduce((acc, p) => {
            acc[p.gameType] = (acc[p.gameType] ?? 0) + 1;
            return acc;
        }, {}),
    });
});
export default router;
//# sourceMappingURL=admin.js.map