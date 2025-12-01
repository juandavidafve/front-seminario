import { Icon } from "@iconify/react";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePensum } from "@/hooks/usePensum";
import { toogleSubjectViewed } from "@/services/pensum";
import type { Subject } from "@/types/Pensum";

interface Props {
  subject: Subject;
}

export default function SubjectEnrollmentCheckbox({ subject }: Props) {
  const { refresh } = usePensum();
  const [loading, setLoading] = useState(false);

  async function hangleToggle() {
    setLoading(true);
    await toogleSubjectViewed(subject.code);
    await refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2" key={subject.code}>
      {!loading ? (
        <Checkbox
          id={subject.code}
          checked={subject.isCompleted}
          onCheckedChange={hangleToggle}
        />
      ) : (
        <Icon icon="svg-spinners:270-ring" className="size-4 text-primary" />
      )}

      <Label htmlFor={subject.code}>{subject.name}</Label>
    </div>
  );
}
