import Filter from "bad-words";
const filter = new Filter();
export function isClean(text) {
    return !filter.isProfane(text);
}
export function sanitize(text) {
    return filter.clean(text);
}
// Reports live only for the lifetime of this server session by design.
const reports = [];
export function fileReport(report) {
    const entry = {
        ...report,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
    };
    reports.push(entry);
    return entry;
}
export function listReports() {
    return [...reports].sort((a, b) => b.createdAt - a.createdAt);
}
//# sourceMappingURL=moderation.js.map