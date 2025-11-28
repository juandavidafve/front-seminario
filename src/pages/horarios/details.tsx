import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  addSubject,
  changeGroup,
  deleteGroup,
  getScheduleById,
  updateTitle,
} from "@/services/schedule";
import type { Group, Subject } from "@/types/Pensum";
import type { Schedule, ScheduleGroup } from "@/types/Schedule";

import GroupSelect from "./components/GroupSelect";
import NameInput from "./components/NameInput";
import SubjectSelect from "./components/SubjectSelect";

export default function ScheduleDetails() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const [schedule, setSchedule] = useState<Schedule>();

  useEffect(() => {
    if (!id) return;

    (async () => {
      setSchedule(await getScheduleById(id));
    })();
  }, [id]);

  async function handleTitleUpdate(title: string) {
    const updatedSchedule = await updateTitle(id, title);
    setSchedule(updatedSchedule);
  }

  async function handleSubjectAdd(subject: Subject) {
    const updatedSchedule = await addSubject(id, subject.code);
    setSchedule(updatedSchedule);
  }

  async function handleGroupDelete(group: ScheduleGroup) {
    const updatedSchedule = await deleteGroup(id, group.code);
    setSchedule(updatedSchedule);
  }

  async function handleGroupChange(groupSchedule: ScheduleGroup, group: Group) {
    const updatedSchedule = await changeGroup(
      id,
      groupSchedule.code,
      group.code,
    );
    setSchedule(updatedSchedule);
  }

  if (!schedule) return;

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Detalles de horario</h1>

      <NameInput schedule={schedule} onChange={handleTitleUpdate} />

      <h2 className="mt-12 mb-4 text-xl font-bold">Materias</h2>

      <Card>
        <CardContent className="space-y-4">
          <SubjectSelect onSelect={handleSubjectAdd} />

          <div className="space-y-2">
            {schedule?.subjects.map((subject) => (
              <div className="flex items-center gap-2">
                <GroupSelect
                  key={subject.group.code}
                  group={subject.group}
                  onSelect={(group) => handleGroupChange(subject.group, group)}
                />
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  onClick={() => handleGroupDelete(subject.group)}
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
        <CardFooter>
          <span className="mr-2 font-bold">Total:</span>
          <span>{schedule.credits} Créditos</span>
        </CardFooter>
      </Card>
    </>
  );
}
