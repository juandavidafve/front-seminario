import { RefreshCw } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { PensumChangeLog } from "@/types/Changelog";

import { SubjectSingleChangelog } from "./SubjectSingleChangelog";

interface PSCProps {
  changelog: PensumChangeLog;
}

export default function PensumSingleChangelog({ changelog }: PSCProps) {
  const changeDate = new Date(changelog.date);
  const formattedDate = changeDate.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const totalChanges = changelog.subjectChangeLogs.reduce((acc, subject) => {
    return (
      acc +
      (Object.keys(subject.fieldChanges).length > 0 ? 1 : 0) +
      subject.groupChangeLogs.length
    );
  }, 0);

  return (
    <AccordionItem value={changelog.id.toString()}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <div className="text-left">
              <h3 className="text-base font-semibold">
                Actualización {formattedDate}
              </h3>
              <p className="text-xs text-muted-foreground">
                {changelog.subjectChangeLogs.length} materia(s) · {totalChanges}{" "}
                cambio(s)
              </p>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 pt-2">
          {changelog.subjectChangeLogs.map((subject, i) => (
            <>
              {i ? <Separator /> : ""}
              <SubjectSingleChangelog changelog={subject} key={subject.id} />
            </>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
