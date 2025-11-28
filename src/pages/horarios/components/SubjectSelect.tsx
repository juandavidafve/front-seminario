import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/redux";
import type { Subject } from "@/types/Pensum";

interface Props {
  onSelect(subject: Subject): void;
}

export default function SubjectSelect({ onSelect }: Props) {
  const subjects = useAppSelector((state) => state.pensum.data?.subjects);
  const [subject, setSubject] = useState<Subject>();

  function handleSelect() {
    if (!subject) return;

    onSelect(subject);
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-2">
      <div className="space-y-2">
        <Label htmlFor="subjectSearch">Nombre o Código de Materia</Label>
        <Combobox
          id="subjectSearch"
          items={subjects || []}
          itemValue={(item) => item.code}
          itemLabel={(item) => `${item.code} - ${item.name}`}
          value={subject}
          onChange={setSubject}
        />
      </div>
      <Button onClick={handleSelect}>Agregar</Button>
    </div>
  );
}
