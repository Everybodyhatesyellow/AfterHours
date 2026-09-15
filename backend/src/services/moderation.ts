import Filter from "bad-words";

const filter = new Filter();

export function isClean(text: string): boolean {
  return !filter.isProfane(text);
}

export function sanitize(text: string): string {
  return filter.clean(text);
}

interface Report {
  id: string;
  code: string;
  promptId?: string;
  targetPlayerId?: string;
  reason: string;
  createdAt: number;
}

// Reports live only for the lifetime of this server session by design.
const reports: Report[] = [];

export function fileReport(report: Omit<Report, "id" | "createdAt">) {
  const entry: Report = {
    ...report,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  reports.push(entry);
  return entry;
}

export function listReports(): Report[] {
  return [...reports].sort((a, b) => b.createdAt - a.createdAt);
}
