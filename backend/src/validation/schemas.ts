import { z } from "zod";

export const createRoomSchema = z
  .object({
    nickname: z.string().trim().min(1).max(20),
    avatar: z.string().min(1).max(8),
    vibes: z
      .array(
        z.enum([
          "chaotic",
          "wild",
          "flirty",
          "party",
          "deep",
          "competitive",
          "adult",
          "mix",
        ]),
      )
      .min(1),
    intensity: z.enum(["chill", "normal", "bold", "wild"]),
    rounds: z.union([
      z.literal(10),
      z.literal(20),
      z.literal(30),
      z.literal(-1),
    ]),
    timer: z.union([z.literal(15), z.literal(30), z.literal(60), z.literal(0)]),
    votingEnabled: z.boolean(),
    pointsEnabled: z.boolean(),
    customContentEnabled: z.boolean(),
    miniGamesEnabled: z.boolean(),
    randomEventsEnabled: z.boolean(),
    deviceMode: z.enum(["shared", "pass_and_play"]).default("shared"),
    playerNames: z
      .array(z.string().trim().min(1).max(20))
      .min(2)
      .max(12)
      .optional(),
  })
  .superRefine((data, context) => {
    if (data.deviceMode === "pass_and_play" && !data.playerNames) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["playerNames"],
        message: "Add at least two player names.",
      });
    }
  });

export const joinRoomSchema = z.object({
  code: z.string().trim().toUpperCase().length(5),
  nickname: z.string().trim().min(1).max(20),
  avatar: z.string().min(1).max(8),
});

export const unlockAdultModeSchema = z.object({
  code: z.string().trim().toUpperCase().length(5),
  confirmed18: z.literal(true),
});

export const submitAnswerSchema = z.object({
  code: z.string().trim().toUpperCase().length(5),
  value: z.string().max(500),
  playerId: z.string().optional(),
});

export const submitCustomPromptSchema = z.object({
  code: z.string().trim().toUpperCase().length(5),
  gameType: z.enum(["truth", "dare"]),
  text: z.string().trim().min(3).max(280),
});

export const reportContentSchema = z.object({
  code: z.string().trim().toUpperCase().length(5),
  promptId: z.string().optional(),
  targetPlayerId: z.string().optional(),
  reason: z.string().trim().min(1).max(280),
});
