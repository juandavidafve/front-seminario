import { z } from "zod";

export const MessageRequestSchema = z.object({
  session_id: z.int(),
  message: z.string(),
});

export const MessageResponseSchema = z.object({
  session_id: z.int(),
  reply: z.string(),
});
