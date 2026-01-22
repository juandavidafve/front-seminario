import type z from "zod";

import {
  GroupChangeLogSchema,
  SubjectChangeLogSchema,
  PensumChangeLogSchema,
  FieldChangeSchema,
  FieldChangesSchema,
} from "@/schemas/Changelog";

// Tipos inferidos
export type GroupChangeLog = z.infer<typeof GroupChangeLogSchema>;
export type SubjectChangeLog = z.infer<typeof SubjectChangeLogSchema>;
export type PensumChangeLog = z.infer<typeof PensumChangeLogSchema>;
export type FieldChange = z.infer<typeof FieldChangeSchema>;
export type FieldChanges = z.infer<typeof FieldChangesSchema>;
