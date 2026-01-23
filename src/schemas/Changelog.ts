import z from "zod";

// Esquema genérico para cambios de campo (acepta cualquier tipo de valor)
export const FieldChangeSchema = z.object({
  oldValue: z.unknown(),
  newValue: z.unknown(),
});

// fieldChanges es un Record donde la clave es el nombre del campo
export const FieldChangesSchema = z.record(z.string(), FieldChangeSchema);

export const GroupChangeLogSchema = z.object({
  id: z.number(),
  code: z.string(),
  type: z.enum(["ADDED", "MODIFIED", "DELETED"]),
  fieldChanges: FieldChangesSchema,
});

export const SubjectChangeLogSchema = z.object({
  id: z.number(),
  code: z.string(),
  type: z.enum(["ADDED", "MODIFIED", "DELETED"]),
  name: z.string(),
  groupChangeLogs: z.array(GroupChangeLogSchema),
  fieldChanges: FieldChangesSchema,
});

export const PensumChangeLogSchema = z.object({
  id: z.number(),
  date: z.number(), // Mantener como timestamp para Redux (serializable)
  pensumId: z.number(),
  pensumName: z.string(),
  subjectChangeLogs: z.array(SubjectChangeLogSchema),
});

// Esquema para array de changelogs
export const PensumChangeLogsSchema = z.array(PensumChangeLogSchema);
