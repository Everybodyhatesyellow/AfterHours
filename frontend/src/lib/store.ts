import { create } from "zustand";
import type { RoomState } from "../types/domain";

interface SessionState {
  playerId: string | null;
  room: RoomState | null;
  lastResult: { summary: string; reveal?: Record<string, unknown> } | null;
  setPlayerId: (id: string) => void;
  setRoom: (room: RoomState) => void;
  setLastResult: (result: SessionState["lastResult"]) => void;
  reset: () => void;
}

export const useSession = create<SessionState>((set) => ({
  playerId: null,
  room: null,
  lastResult: null,
  setPlayerId: (id) => set({ playerId: id }),
  setRoom: (room) => set({ room }),
  setLastResult: (result) => set({ lastResult: result }),
  reset: () => set({ playerId: null, room: null, lastResult: null }),
}));
