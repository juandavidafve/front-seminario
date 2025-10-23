import { z } from "zod";

export const SubjectTypeEnum = z.enum([
  "MANDATORY",
  "ELECTIVE",
  "SOCIOHUMANISTIC_ELECTIVE",
  "PROFESSIONAL_ELECTIVE",
]);

export const SessionSchema = z.object({
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

export const GroupSchema = z
  .object({
    code: z.string(),
    teacher: z.string(),
    program: z.string(),
    maxCapacity: z.int().nonnegative(),
    availableCapacity: z.int().nonnegative(),
    sessions: z.array(SessionSchema),
    //currentTeacher: z.boolean(),
  })
  .superRefine((group, ctx) => {
    // Validar que no haya cruce de horarios
    const schedule = Array.from({ length: 6 }, () => Array(17).fill(false));

    for (let i = 0; i < group.sessions.length; i++) {
      const session = group.sessions[i];
      const duration = session.endHour - session.beginHour;

      for (let j = 0; j < duration; j++) {
        const pos = session.beginHour + j;
        if (!schedule[session.day][pos]) {
          schedule[session.day][pos] = true;
        } else {
          ctx.addIssue({
            code: "custom",
            message: "Hay sesiones que se cruzan.",
            path: ["sessions", i, "beginHour"],
          });
        }
      }
    }

    // Validar que cada sesión tenga beginHour < endHour
    group.sessions.forEach((s, index) => {
      if (s.beginHour >= s.endHour) {
        ctx.addIssue({
          code: "custom",
          message: "La hora de fin debe ser mayor que la hora de inicio.",
          path: ["sessions", index, "beginHour"],
        });
      }
    });
  });

export const RequisiteSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const SubjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  credits: z.int().positive(),
  hours: z.int().positive(),
  semester: z.int().positive(),
  requiredCredits: z.int().min(0),
  type: SubjectTypeEnum,
  groups: z.array(GroupSchema),
  requisites: z.array(RequisiteSchema),
});

export const PensumSchema = z.object({
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
