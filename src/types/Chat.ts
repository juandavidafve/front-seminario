import type z from "zod";

import type {
  MessageRequestSchema,
  MessageResponseSchema,
} from "@/schemas/Chat";

export type MessageRequest = z.infer<typeof MessageRequestSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
