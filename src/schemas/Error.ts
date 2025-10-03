import z from "zod";

export const ApiErrorSchema = z.object({
  timestamp: z.number(),
  status: z.number(),
  error: z.string(),
  message: z.string(),
  path: z.string(),
});
