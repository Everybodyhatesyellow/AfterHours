import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useSession } from "../lib/store";
import type { RoomState } from "../types/domain";

/** Subscribes to room:state / round:result broadcasts for the lifetime of the component tree. */
export function useRoomSync() {
  const setRoom = useSession((s) => s.setRoom);
  const setLastResult = useSession((s) => s.setLastResult);

  useEffect(() => {
    const socket = getSocket();

    const onState = (state: RoomState) => setRoom(state);
    const onResult = (result: { summary: string; reveal?: Record<string, unknown> }) =>
      setLastResult(result);

    socket.on("room:state", onState);
    socket.on("round:result", onResult);

    return () => {
      socket.off("room:state", onState);
      socket.off("round:result", onResult);
    };
  }, [setRoom, setLastResult]);
}
