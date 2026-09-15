// ---------------------------------------------------------------------------
// AFTERHOURS — core domain types
// Shared shape between the game engine, the socket layer, and (via a copy in
// frontend/src/types) the client. Keep this file framework-agnostic.
// ---------------------------------------------------------------------------

export type Vibe =
  | "chaotic"
  | "wild"
  | "flirty"
  | "party"
  | "deep"
  | "competitive"
  | "adult"
  | "mix";

export type Intensity = "chill" | "normal" | "bold" | "wild";

export type AgeRating = "all" | "mild18" | "bold18" | "wild18";

export type GameType =
  | "truth"
  | "dare"
  | "this_or_that"
  | "two_truths_and_a_lie"
  | "hot_seat"
  | "would_you_rather"
  | "never_have_i_ever"
  | "most_likely_to"
  | "who_would_you_date"
  | "who_knows_who"
  | "hot_seat"
  | "roast_round"
  | "confess_or_challenge"
  | "vote"
  | "group_challenge"
  | "one_v_one"
  | "random_event"
  | "mini_game";

export type TimerOption = 15 | 30 | 60 | 0; // 0 = no timer
export type RoundsOption = 10 | 20 | 30 | -1; // -1 = endless

export interface Prompt {
  id: string;
  gameType: GameType;
  category: string; // e.g. "funny", "embarrassing", "deep", "relationship"
  subcategory?: string;
  text: string;
  choices?: [string, string];
  intensity: Intensity;
  ageRating: AgeRating;
  difficulty: 1 | 2 | 3;
  minPlayers: number;
  tags: string[];
  allowSkip: boolean;
  active: boolean;
  isCustom?: boolean;
  createdBy?: string; // player id, for custom content
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string; // emoji
  isHost: boolean;
  connected: boolean;
  ready: boolean;
  score: number;
  streak: number;
  badges: string[];
  turnsTaken: number;
  lastDifficulty: number;
  joinedAt: number;
}

export interface RoomSettings {
  vibes: Vibe[];
  intensity: Intensity;
  rounds: RoundsOption;
  timer: TimerOption;
  votingEnabled: boolean;
  pointsEnabled: boolean;
  customContentEnabled: boolean;
  miniGamesEnabled: boolean;
  randomEventsEnabled: boolean;
  adultModeUnlocked: boolean; // gated behind 18+ confirmation
}

export type RoomStatus = "lobby" | "in_progress" | "results" | "closed";
export type DeviceMode = "shared" | "pass_and_play";

export interface RoomState {
  code: string;
  deviceMode: DeviceMode;
  hostId: string;
  status: RoomStatus;
  settings: RoomSettings;
  players: Record<string, Player>;
  round: number;
  currentPrompt: Prompt | null;
  currentPlayerId: string | null;
  playlist: GameType[];
  playlistIndex: number;
  usedPromptIds: string[];
  categoryHistory: GameType[];
  votes: Record<string, string>; // voterId -> targetId or answerId
  createdAt: number;
  updatedAt: number;
}

export interface ScoreEvent {
  playerId: string;
  points: number;
  reason: string;
}

export interface SuperlativeResult {
  title: string; // e.g. "Party Champion"
  playerId: string;
  nickname: string;
  avatar: string;
}
