import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";
import { useAppSelector } from "@/hooks/redux";
import type { Subject } from "@/types/Pensum";

import SubjectEnrollmentCheckbox from "./SubjectEnrollmentCheckbox";

export default function SubjectEnrollment() {
  const pensum = useAppSelector((state) => state.pensum.data);
  const [subjectValue, setSubjectValue] = useState<string>("");

  const filteredBySemester = useMemo(() => {
    if (!pensum) return [];
    const base: Subject[][] = Array.from(
      { length: pensum.semesters },
      () => [],
    );
    for (const subject of pensum.subjects) {
      base[subject.semester - 1].push(subject);
    }
    const reversed = base.reverse();

    const q = subjectValue.trim().toLowerCase();

    if (!q) return reversed;

    return reversed.map((subjects) =>
      subjects.filter((s) => {
        const key = `${s.code} - ${s.name}`.toLowerCase();
        return key.includes(q);
      }),
    );
  }, [pensum, subjectValue]);

  // Used as controlled value for accordion, to prevent collapsing
  const allAccordionValues = useMemo(
    () =>
      filteredBySemester
        .map((_, i) => (_.length ? String(i) : null))
        .filter((e) => e !== null),
    [filteredBySemester],
  );

  const onChangeValue = (value: string) => {
    setSubjectValue(value);
  };

  const results = filteredBySemester.map((subjects, i) => {
    if (subjects.length) {
      return (
        <AccordionItem key={i} value={String(i)}>
          <AccordionTrigger>
            Semestre {filteredBySemester.length - i}
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {subjects.map((subject) => (
              <SubjectEnrollmentCheckbox subject={subject} key={subject.code} />
            ))}
          </AccordionContent>
        </AccordionItem>
      );
    } else {
      return null;
    }
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="mt-2 mb-4 text-xl font-bold">Materias vistas</h2>
      <p className="rounded-lg border border-blue-300 bg-blue-100 p-2">
        <span className="font-bold">Tip:</span> Empieza por marcar las materias
        de los semestres superiores; los requisitos se activarán
        automáticamente.
      </p>

      <Command className="mt-2 h-auto">
        <CommandInput
          placeholder="Buscar..."
          value={subjectValue}
          onValueChange={onChangeValue}
        />
      </Command>

      <div className="mt-4 flex-1 overflow-auto">
        {subjectValue.trim() ? (
          <Accordion type="multiple" value={allAccordionValues}>
            {results}
          </Accordion>
        ) : (
          <Accordion type="single" collapsible>
            {results}
          </Accordion>
        )}
      </div>
    </div>
  );
}
