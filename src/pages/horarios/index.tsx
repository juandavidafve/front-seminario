import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createSchedule,
  deleteSchedule,
  duplicateSchedule,
  getSchedules,
} from "@/services/schedule";
import type { Schedule } from "@/types/Schedule";

export default function Horarios() {
  const {
    result: schedules,
    loading: schedulesLoading,
    execute: refreshSchedules,
  } = useAsync(getSchedules, []);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!schedules) return;

    setFilteredSchedules([...schedules]);
  }, [schedules]);

  async function handleCreate() {
    await createSchedule("Nuevo horario");
    await refreshSchedules();
  }

  async function handleDelete(schedule: Schedule) {
    await deleteSchedule(schedule.id);
    await refreshSchedules();
  }

  async function handleCopy(schedule: Schedule) {
    await duplicateSchedule(schedule.id);
    await refreshSchedules();
  }

  async function handleSearch(query: string) {
    if (!schedules) return;

    setFilteredSchedules(
      schedules.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Horarios</h1>
      <div className="flex justify-between gap-2">
        <Input
          placeholder="Buscar por nombre"
          className="max-w-sm"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button onClick={handleCreate}>Crear</Button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredSchedules?.map((schedule) => (
          <Card className="gap-4" key={schedule.id}>
            <CardHeader>
              <CardTitle>{schedule.title}</CardTitle>
              <CardDescription>{schedule.credits} créditos</CardDescription>
            </CardHeader>
            <CardContent className="space-x-2">
              {schedule.subjects.map((subject) => (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge key={subject.group.code}>{subject.group.code}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>{subject.group.name}</TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
            <CardFooter className="justify-between">
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(schedule)}
                >
                  <Icon icon="ic:round-content-copy" className="size-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(schedule)}
                >
                  <Icon icon="ic:round-delete-outline" className="size-6" />
                </Button>
              </div>

              <Link to={`${schedule.id}`}>
                <Button>Ver detalle</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {schedulesLoading && filteredSchedules.length === 0 && (
        <div className="my-10 flex items-center justify-center">
          <Icon
            icon="svg-spinners:blocks-shuffle-3"
            className="size-12 text-primary"
          />
        </div>
      )}
      {!schedulesLoading && filteredSchedules.length === 0 && (
        <div className="my-10 flex items-center justify-center">
          No hay horarios
        </div>
      )}
    </>
  );
}
