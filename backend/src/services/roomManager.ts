import { customAlphabet } from "nanoid";
import { RoomEngine } from "../game-engine/RoomEngine.js";
import type { DeviceMode, Player, RoomSettings } from "../types/domain.js";

// Room codes: 5 chars, uppercase alphanumeric, no ambiguous chars (0/O, 1/I).
const generateCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 5);

const rooms = new Map<string, RoomEngine>();

export const DEFAULT_SETTINGS: RoomSettings = {
  vibes: ["party"],
  intensity: "normal",
  rounds: 20,
  timer: 30,
  votingEnabled: true,
  pointsEnabled: true,
  customContentEnabled: true,
  miniGamesEnabled: true,
  randomEventsEnabled: true,
  adultModeUnlocked: false,
};

export function createRoom(
  host: Player,
  settings: Partial<RoomSettings> = {},
  deviceMode: DeviceMode = "shared",
): RoomEngine {
  let code = generateCode();
  while (rooms.has(code)) code = generateCode(); // guard against the rare collision

  const engine = RoomEngine.create(
    code,
    host,
    { ...DEFAULT_SETTINGS, ...settings },
    deviceMode,
  );
  rooms.set(code, engine);
  return engine;
}

export function getRoom(code: string): RoomEngine | undefined {
  return rooms.get(code.toUpperCase());
}

export function deleteRoom(code: string) {
  rooms.delete(code.toUpperCase());
}

/** Periodic sweep: close rooms that have been idle for too long. */
export function sweepStaleRooms(maxIdleMs = 1000 * 60 * 60 * 4) {
  const now = Date.now();
  for (const [code, engine] of rooms) {
    if (now - engine.state.updatedAt > maxIdleMs) {
      rooms.delete(code);
    }
  }
}
