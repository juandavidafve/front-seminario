import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Group, Subject } from "@/types/Pensum";
import type { Schedule, ScheduleGroup } from "@/types/Schedule";

import GroupSelect from "./GroupSelect";
import SubjectSelect from "./SubjectSelect";

interface Props {
  schedule: Schedule;
  onSubjectAdd(subject: Subject): void;
  onGroupChange(groupSchedule: ScheduleGroup, group: Group): void;
  onGroupDelete(group: ScheduleGroup): void;
}

export default function SubjectCard({
  schedule,
  onGroupChange,
  onGroupDelete,
  onSubjectAdd,
}: Props) {
  return (
    <Card className="mb-6">
      <CardContent className="space-y-4">
        <SubjectSelect isFreeMode={schedule.freeMode} onSelect={onSubjectAdd} />

        <div className="space-y-2">
          {schedule?.subjects.map((subject) => (
            <div className="flex items-center gap-2">
              <GroupSelect
                key={subject.group.code}
                group={subject.group}
                onSelect={(group) => onGroupChange(subject.group, group)}
              />
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => onGroupDelete(subject.group)}
              >
                <Icon
                  icon="material-symbols:delete-outline-rounded"
                  className="size-6"
                />
              </Button>
            </div>
          ))}
          {schedule?.subjects.length === 0 && (
            <p className="text-center text-muted-foreground">
              No hay materias seleccionadas
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="block">
        <p>
          <span className="mr-2 font-bold">Total:</span>
          {schedule.credits} Créditos - {schedule.credits * 48} horas de trabajo
        </p>
        <p>
          <span className="mr-2 font-bold">Semanal:</span>
          <span>{(schedule.credits * 48) / 16} horas de trabajo</span>
        </p>
      </CardFooter>
    </Card>
  );
}
