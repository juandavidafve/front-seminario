import { api } from "@/lib/axios";
import { PensumSchema, type Pensum } from "@/schemas/Pensum";

export async function getPensum() {
  //const req = await api.get(
  //  "https://divisistapp-backend-service-mgewfl33zq-uc.a.run.app//materias/pensum/115",
  //);

  const data: Pensum = {
    id: 1,
    name: "Ingeniería de Sistemas - Pensum Ejemplo 2025",
    semesters: 10,
    subjects: [
      {
        id: 1,
        code: "1150201",
        name: "Matemáticas I",
        credits: 4,
        hours: 4,
        semester: 1,
        requiredCredits: 0 + 1, // >0 required by schema; use 1 if no prerequisite-credit requirement
        type: "MANDATORY",
        groups: [
          {
            id: 1,
            code: "A",
            teacher: "Dr. Juan Pérez",
            program: "2025-A",
            maxCapacity: 40,
            availableCapacity: 12,
            sessions: [
              { id: 1, day: 0, beginHour: 2, endHour: 4, classroom: "B101" },
              { id: 2, day: 2, beginHour: 2, endHour: 4, classroom: "B101" },
            ],
          },
        ],
        requisites: [],
      },

      {
        id: 2,
        code: "1150301",
        name: "Cálculo vectorial",
        credits: 4,
        hours: 4,
        semester: 3,
        requiredCredits: 4,
        type: "MANDATORY",
        groups: [
          {
            id: 2,
            code: "B",
            teacher: "Dra. María Gómez",
            program: "2025-A",
            maxCapacity: 35,
            availableCapacity: 8,
            sessions: [
              { id: 3, day: 1, beginHour: 3, endHour: 5, classroom: "C201" },
            ],
          },
        ],
        requisites: [{ id: 1, name: "Matemáticas I", code: "1150201" }],
      },
    ],
  };

  return data;
}
