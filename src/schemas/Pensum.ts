import { z } from "zod";

export const SubjectTypeEnum = z.enum([
  "MANDATORY",
  "ELECTIVE",
  "SOCIOHUMANISTIC_ELECTIVE",
  "PROFESSIONAL_ELECTIVE",
]);

export const SessionSchema = z.object({
  id: z.int().nonnegative(),
  /**
   * 0: Monday
   * ...
   * 5: Saturday
   */
  day: z.int().min(0).max(5),
  /**
   * 0: 06:00
   * ...
   * 16: 22:00
   */
  beginHour: z.int().min(0).max(16),
  endHour: z.int().min(0).max(16),
  classroom: z.string(),
});

export const GroupSchema = z.object({
  id: z.int().nonnegative(),
  code: z.string(),
  teacher: z.string(),
  program: z.string(),
  maxCapacity: z.int().nonnegative(),
  availableCapacity: z.int().nonnegative(),
  sessions: z.array(SessionSchema),
  //currentTeacher: z.boolean(),
});

export const RequisiteSchema = z.object({
  id: z.int().nonnegative(),
  name: z.string(),
  code: z.string(),
});

export const SubjectSchema = z.object({
  id: z.int().nonnegative(),
  code: z.string(),
  name: z.string(),
  credits: z.int().positive(),
  hours: z.int().positive(),
  semester: z.int().positive(),
  requiredCredits: z.int().positive(),
  type: SubjectTypeEnum,
  groups: z.array(GroupSchema),
  requisites: z.array(RequisiteSchema),
});

export const PensumSchema = z.object({
  id: z.int().nonnegative(),
  name: z.string(),
  semesters: z.int().positive(),
  subjects: z.array(SubjectSchema),
});

/** Inferencia de tipos TypeScript */
export type Session = z.infer<typeof SessionSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Requisite = z.infer<typeof RequisiteSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type Pensum = z.infer<typeof PensumSchema>;
