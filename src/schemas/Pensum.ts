import { z } from "zod";

export const SubjectTypeEnum = z.enum([
  "MANDATORY",
  "ELECTIVE",
  "SOCIOHUMANISTIC_ELECTIVE",
  "PROFESSIONAL_ELECTIVE",
]);

export const SessionSchema = z
  .object({
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
  })
  .superRefine((session, ctx) => {
    if (session.beginHour >= session.endHour) {
      ctx.addIssue({
        code: "custom",
        message: "La hora de fin debe ser mayor que la hora de inicio.",
      });
    }
  });

export const GroupSchema = z
  .object({
    code: z.string().nonempty("El código no puede estar vacío"),
    teacher: z.string(),
    program: z.string(),
    maxCapacity: z.int().nonnegative(),
    availableCapacity: z.int().nonnegative(),
    sessions: z.array(SessionSchema),
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
            path: ["sessions"],
            message: "Hay sesiones que se cruzan.",
          });
        }
      }
    }
  });

export const RequisiteSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const SubjectSchema = z.object({
  code: z.string().nonempty("El código no debe estar vacío"),
  name: z.string().nonempty("El nombre no puede estar vacío"),
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
