import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import VibeGrid from "../components/VibeGrid";
import SegmentedControl from "../components/SegmentedControl";
import AgeGateModal from "../components/AgeGateModal";
import { emitWithAck } from "../lib/socket";
import { useSession } from "../lib/store";
import type {
  DeviceMode,
  Intensity,
  RoomState,
  RoundsOption,
  TimerOption,
  Vibe,
} from "../types/domain";

const AVATARS = ["😈", "🔥", "💋", "🥶", "👀", "🎉", "🧃", "🐍", "🦋", "🍒"];

export default function CreateParty() {
  const navigate = useNavigate();
  const setPlayerId = useSession((s) => s.setPlayerId);
  const setRoom = useSession((s) => s.setRoom);

  const [nickname, setNickname] = useState("");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("shared");
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [vibes, setVibes] = useState<Vibe[]>(["party"]);
  const [intensity, setIntensity] = useState<Intensity>("normal");
  const [rounds, setRounds] = useState<RoundsOption>(20);
  const [timer, setTimer] = useState<TimerOption>(30);
  const [toggles, setToggles] = useState({
    votingEnabled: true,
    pointsEnabled: true,
    customContentEnabled: true,
    miniGamesEnabled: true,
    randomEventsEnabled: true,
  });
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleVibe(v: Vibe) {
    if (v === "adult" && !vibes.includes("adult")) {
      setShowAgeGate(true);
      return;
    }
    setVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }

  async function handleCreate() {
    const names = playerNames.map((name) => name.trim()).filter(Boolean);
    if (deviceMode === "shared" && !nickname.trim())
      return setError("Give yourself a party name first.");
    if (deviceMode === "pass_and_play" && names.length < 2)
      return setError("Add at least two player names.");
    if (
      deviceMode === "pass_and_play" &&
      new Set(names.map((name) => name.toLowerCase())).size !== names.length
    ) {
      return setError("Each player needs a different name.");
    }
    setError(null);
    setLoading(true);
    try {
      const res = await emitWithAck<{
        code: string;
        playerId: string;
        room: RoomState;
      }>("room:create", {
        nickname: deviceMode === "shared" ? nickname : names[0],
        avatar,
        vibes,
        intensity,
        rounds,
        timer,
        deviceMode,
        playerNames: deviceMode === "pass_and_play" ? names : undefined,
        ...toggles,
      });
      setPlayerId(res.playerId);
      setRoom(res.room);
      navigate(`/room/${res.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create the room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-mute hover:text-bone"
      >
        ← Back
      </button>
      <h1 className="mt-4 font-display text-4xl">Choose your vibe</h1>
      <p className="mt-2 text-mute">
        Pick as many as you want — the game rotates between them.
      </p>

      <div className="mt-6">
        <VibeGrid selected={vibes} onToggle={toggleVibe} />
      </div>

      <div className="mt-8 rounded-card border border-white/10 bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-mute">
          How are you playing?
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              [
                "shared",
                "Everyone on their own phone",
                "Share a room code or link.",
              ],
              [
                "pass_and_play",
                "One phone, pass it around",
                "Add names once. No link needed.",
              ],
            ] as const
          ).map(([value, title, description]) => (
            <button
              key={value}
              type="button"
              onClick={() => setDeviceMode(value)}
              className={`focus-ring rounded-card border p-4 text-left transition-colors ${deviceMode === value ? "border-coral bg-coral/10" : "border-white/10 bg-surfaceHigh"}`}
            >
              <div className="font-semibold text-bone">{title}</div>
              <div className="mt-1 text-xs text-mute">{description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <SegmentedControl
          label="Rounds"
          value={rounds}
          onChange={setRounds}
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 30, label: "30" },
            { value: -1, label: "Endless" },
          ]}
        />
        <SegmentedControl
          label="Intensity"
          value={intensity}
          onChange={setIntensity}
          options={[
            { value: "chill", label: "Chill" },
            { value: "normal", label: "Normal" },
            { value: "bold", label: "Bold" },
            { value: "wild", label: "Wild" },
          ]}
        />
        <SegmentedControl
          label="Timer"
          value={timer}
          onChange={setTimer}
          options={[
            { value: 15, label: "15s" },
            { value: 30, label: "30s" },
            { value: 60, label: "60s" },
            { value: 0, label: "No timer" },
          ]}
        />

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute">
            Features
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(toggles).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setToggles((t) => ({
                    ...t,
                    [key]: !t[key as keyof typeof t],
                  }))
                }
                className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium ${
                  val
                    ? "border-gold bg-gold/10 text-bone"
                    : "border-white/10 text-mute"
                }`}
              >
                {val ? "☑" : "☐"} {labelFor(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-card border border-white/10 bg-surface p-6">
        <h2 className="font-display text-xl">
          {deviceMode === "pass_and_play" ? "Who's playing?" : "You're hosting"}
        </h2>
        <p className="mt-1 text-sm text-mute">
          {deviceMode === "pass_and_play"
            ? "Add everyone joining this phone. Names appear during turns."
            : "This is how the room will see you."}
        </p>
        {deviceMode === "pass_and_play" ? (
          <div className="mt-4 space-y-2">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={name}
                  onChange={(event) =>
                    setPlayerNames((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                  placeholder={`Player ${index + 1} name`}
                  maxLength={20}
                  className="focus-ring min-w-0 flex-1 rounded-full border border-white/10 bg-surfaceHigh px-4 py-3 text-bone placeholder:text-mute"
                />
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPlayerNames((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="focus-ring px-3 text-sm text-mute hover:text-coral"
                    aria-label={`Remove player ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPlayerNames((current) => [...current, ""])}
              className="focus-ring text-sm font-semibold text-gold hover:text-bone"
            >
              + Add another name
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Party name (e.g. Rodney, Trouble, The CEO)"
              maxLength={20}
              className="focus-ring flex-1 rounded-full border border-white/10 bg-surfaceHigh px-4 py-3 text-bone placeholder:text-mute"
            />
            <div className="flex gap-1.5">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`focus-ring h-10 w-10 rounded-full text-lg ${
                    avatar === a
                      ? "bg-coral/20 ring-2 ring-coral"
                      : "bg-surfaceHigh"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-coral">{error}</p>}

      <div className="mt-8">
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating room..." : "Create room"}
        </Button>
      </div>

      {showAgeGate && (
        <AgeGateModal
          onConfirm={() => {
            setVibes((prev) => [...prev, "adult"]);
            setShowAgeGate(false);
          }}
          onCancel={() => setShowAgeGate(false)}
        />
      )}
    </div>
  );
}

function labelFor(key: string) {
  return (
    {
      votingEnabled: "Voting",
      pointsEnabled: "Points",
      customContentEnabled: "Custom questions",
      miniGamesEnabled: "Mini-games",
      randomEventsEnabled: "Random events",
    } as Record<string, string>
  )[key];
}
