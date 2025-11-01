import type z from "zod";

import type {
  GroupSchema,
  PensumSchema,
  RequisiteSchema,
  SessionSchema,
  SubjectSchema,
} from "@/schemas/Pensum";

/** Inferencia de tipos TypeScript */
export type Session = z.infer<typeof SessionSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Requisite = z.infer<typeof RequisiteSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type Pensum = z.infer<typeof PensumSchema>;
