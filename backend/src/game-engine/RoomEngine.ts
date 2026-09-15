import type {
  DeviceMode,
  GameType,
  Player,
  Prompt,
  RoomSettings,
  RoomState,
} from "../types/domain.js";
import type { GameMode, GameModeAnswer } from "./GameMode.js";
import { createBasicModes } from "../game-modes/basicModes.js";
import { selectNextPlayer } from "./contentSelector.js";

const CATEGORY_ROTATION: GameType[] = [
  "truth",
  "dare",
  "this_or_that",
  "two_truths_and_a_lie",
  "hot_seat",
  "never_have_i_ever",
  "most_likely_to",
  "vote",
  "would_you_rather",
];

export class RoomEngine {
  private modes: Record<string, GameMode>;

  constructor(public state: RoomState) {
    this.modes = createBasicModes();
  }

  static create(
    code: string,
    host: Player,
    settings: RoomSettings,
    deviceMode: DeviceMode = "shared",
  ): RoomEngine {
    const state: RoomState = {
      code,
      deviceMode,
      hostId: host.id,
      status: "lobby",
      settings,
      players: { [host.id]: host },
      round: 0,
      currentPrompt: null,
      currentPlayerId: null,
      playlist: shuffle([...CATEGORY_ROTATION]),
      playlistIndex: -1,
      usedPromptIds: [],
      categoryHistory: [],
      votes: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return new RoomEngine(state);
  }

  addPlayer(player: Player) {
    this.state.players[player.id] = player;
    this.touch();
  }

  removePlayer(playerId: string) {
    const player = this.state.players[playerId];
    if (!player) return;
    player.connected = false;
    this.touch();
  }

  start() {
    this.state.status = "in_progress";
    this.state.round = 0;
    const hasEnoughPlayersForVoting =
      Object.keys(this.state.players).length >= 3;
    const availableModes = hasEnoughPlayersForVoting
      ? CATEGORY_ROTATION
      : CATEGORY_ROTATION.filter(
          (mode) => mode !== "most_likely_to" && mode !== "vote",
        );
    this.state.playlist = shuffle([...availableModes]);
    this.state.playlistIndex = -1;
    this.advanceRound();
  }

  /** Moves the room to its next round: pick game type, player, prompt. */
  advanceRound() {
    this.state.votes = {};
    this.state.round += 1;

    this.state.playlistIndex =
      (this.state.playlistIndex + 1) % this.state.playlist.length;
    const gameType = this.state.playlist[this.state.playlistIndex];
    const mode = this.modes[gameType];
    if (!mode)
      throw new Error(
        `No implementation registered for game type "${gameType}"`,
      );

    this.state.currentPlayerId = selectNextPlayer(this.state);
    const prompt = mode.generatePrompt(this.state, []);
    this.state.currentPrompt = prompt;

    if (prompt) this.state.usedPromptIds.push(prompt.id);
    this.state.categoryHistory.push(gameType);
    this.touch();
  }

  submitAnswer(answer: GameModeAnswer) {
    const gameType = this.state.currentPrompt?.gameType;
    if (!gameType) return;
    const mode = this.modes[gameType];
    if (!mode) return;
    mode.handleAnswer(this.state, answer);
    this.touch();
  }

  completeRound() {
    const gameType = this.state.currentPrompt?.gameType;
    if (!gameType) return null;
    const mode = this.modes[gameType];
    if (!mode) return null;
    const result = mode.handleCompletion(this.state);
    this.touch();
    return result;
  }

  isRoundExpected(maxRounds: number): boolean {
    return maxRounds === -1 || this.state.round < maxRounds;
  }

  private touch() {
    this.state.updatedAt = Date.now();
  }
}

function shuffle<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}
