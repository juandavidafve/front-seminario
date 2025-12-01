import { useMemo } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppSelector } from "@/hooks/redux";
import type { Subject } from "@/types/Pensum";

import SubjectEnrollmentCheckbox from "./SubjectEnrollmentCheckbox";

export default function SubjectEnrollment() {
  const pensum = useAppSelector((state) => state.pensum.data);

  const subjectsBySemester = useMemo(() => {
    if (!pensum) return [];

    const arr: Subject[][] = Array.from(
      { length: pensum?.semesters },
      () => [],
    );

    for (const subject of pensum.subjects) {
      arr[subject.semester - 1].push(subject);
    }

    return arr.reverse();
  }, [pensum]);

  return (
    <div>
      <h2 className="mt-8 mb-4 text-xl font-bold">Materias vistas</h2>
      <p className="rounded-lg border border-blue-300 bg-blue-100 p-2">
        <span className="font-bold">Tip:</span> Empieza por marcar las materias
        de los semestres superiores; los requisitos se activarán
        automáticamente.
      </p>

      <Accordion type="single" collapsible>
        {subjectsBySemester.map((subjects, i) => (
          <AccordionItem key={i} value={String(i)}>
            <AccordionTrigger>
              Semestre {subjects[0]?.semester}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {subjects.map((subject) => (
                <SubjectEnrollmentCheckbox
                  subject={subject}
                  key={subject.code}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
