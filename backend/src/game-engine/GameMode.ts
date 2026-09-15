import type { Player, Prompt, RoomState, ScoreEvent } from "../types/domain.js";

/**
 * Every game mode (Truth, Dare, Never Have I Ever, Hot Seat, ...) implements
 * this interface. The RoomEngine (see RoomEngine.ts) only ever talks to game
 * modes through this contract, so adding a new mode never requires touching
 * the engine, the socket layer, or other modes.
 */
export interface GameModeAnswer {
  playerId: string;
  value: string; // free text, "DONE"/"SKIP", a vote target id, etc.
  submittedAt: number;
}

export interface GameModeResult {
  scoreEvents: ScoreEvent[];
  summary: string; // short human-readable recap shown in the activity feed
  reveal?: Record<string, unknown>; // mode-specific reveal payload (e.g. vote tally)
}

export interface GameMode {
  readonly type: string;

  /** Which players are eligible to be the "active" player this round. */
  getEligiblePlayers(room: RoomState): Player[];

  /** Produce the next prompt for this round given the room's history. */
  generatePrompt(room: RoomState, pool: Prompt[]): Prompt | null;

  /** Validate + record an answer/vote/dare-completion from a player. */
  handleAnswer(room: RoomState, answer: GameModeAnswer): void;

  /** Called once all required players have answered or the timer expires. */
  handleCompletion(room: RoomState): GameModeResult;

  /** Points awarded for a completed round of this mode, before modifiers. */
  calculateScore(room: RoomState, answer: GameModeAnswer): number;
}
