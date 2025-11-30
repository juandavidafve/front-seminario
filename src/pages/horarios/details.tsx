import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import { cn } from "@/lib/utils";
import {
  addSubject,
  changeGroup,
  deleteGroup,
  getScheduleById,
  updateTitle,
} from "@/services/schedule";
import type { Group, Subject } from "@/types/Pensum";
import type { Schedule, ScheduleGroup } from "@/types/Schedule";

import AIChat from "./components/AIChat";
import NameInput from "./components/NameInput";
import ScheduleViewer from "./components/ScheduleViewer";
import SubjectCard from "./components/SubjectCard";

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

  const messages = useMemo(() => {
    return schedule?.subjects.flatMap((subject) => subject.messages);
  }, [schedule]);

  async function handleTitleUpdate(title: string) {
    const updatedSchedule = await updateTitle(id, title);
    setSchedule(updatedSchedule);
  }

  async function updateSchedule() {
    setSchedule(await getScheduleById(id));
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

      {messages?.map((msg) => (
        <p
          className={cn(
            "mb-4 rounded-lg border p-2",
            msg.type === "INFO" && "border-blue-300 bg-blue-100",
            msg.type === "WARNING" && "border-yellow-300 bg-yellow-100",
            msg.type === "ERROR" && "border-red-300 bg-red-100",
          )}
        >
          <span
            className={cn(
              "font-bold",
              msg.type === "INFO" && "text-blue-800",
              msg.type === "WARNING" && "text-yellow-800",
              msg.type === "ERROR" && "text-red-800",
            )}
          >
            {msg.type === "INFO" && "Info:"}
            {msg.type === "WARNING" && "Advertencia:"}
            {msg.type === "ERROR" && "Error:"}{" "}
          </span>
          {msg.message}
        </p>
      ))}

      <SubjectCard
        schedule={schedule}
        onGroupChange={handleGroupChange}
        onGroupDelete={handleGroupDelete}
        onSubjectAdd={handleSubjectAdd}
      />
      <ScheduleViewer schedule={schedule} />
      <AIChat id={id} updateSchedule={updateSchedule} />
    </>
  );
}
