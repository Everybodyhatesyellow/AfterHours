import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

interface Stats {
  promptCount: number;
  byGameType: Record<string, number>;
}

interface Report {
  id: string;
  code: string;
  reason: string;
  createdAt: number;
}

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const headers = { "x-admin-token": token };
      const [s, r] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }).then((res) => res.json()),
        fetch(`${API_URL}/admin/reports`, { headers }).then((res) => res.json()),
      ]);
      setStats(s);
      setReports(r.reports ?? []);
    } catch {
      setError("Couldn't reach the admin API. Check the server URL and token.");
    }
  }

  useEffect(() => {
    // Auto-load once a token has been entered; no-op on first mount.
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <h1 className="font-display text-3xl">Admin</h1>
      <p className="mt-1 text-sm text-mute">
        Content stats, reports, and moderation. Wire real auth (see backend
        middleware/requireAdmin.ts) before deploying this publicly.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          className="focus-ring flex-1 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm"
        />
        <button
          onClick={load}
          className="focus-ring rounded-full bg-coral px-4 py-2 text-sm font-semibold text-ink"
        >
          Load
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-coral">{error}</p>}

      {stats && (
        <div className="mt-6 rounded-card border border-white/10 bg-surface p-5">
          <div className="text-xs uppercase tracking-wide text-mute">Content library</div>
          <div className="mt-2 text-2xl font-display">{stats.promptCount} prompts</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-mute">
            {Object.entries(stats.byGameType).map(([type, count]) => (
              <span key={type} className="rounded-full border border-white/10 px-2 py-1">
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-card border border-white/10 bg-surface p-5">
        <div className="text-xs uppercase tracking-wide text-mute">Reports</div>
        {reports.length === 0 ? (
          <p className="mt-2 text-sm text-mute">No reports yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <div className="text-mute">Room {r.code}</div>
                <div>{r.reason}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
