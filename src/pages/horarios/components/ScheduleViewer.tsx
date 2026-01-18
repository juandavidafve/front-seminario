import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatHour } from "@/lib/utils";
import type { Schedule } from "@/types/Schedule";

interface Props {
  schedule: Schedule;
}

interface ScheduleCell {
  duration: number;
  classroom: string;
  name: string;
  code: string;
  day: number;
  hour: number;
  color: string;
}

const SUBJECT_COLORS = [
  "bg-red-100",
  "bg-orange-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-pink-100",
];

export default function ScheduleViewer({ schedule }: Props) {
  const { scheduleMatrix, maxDay } = useMemo(() => {
    const cells = schedule.subjects.flatMap((subject, i) => {
      return subject.group.sessions.map((session) => ({
        duration: session.endHour - session.beginHour,
        classroom: session.classroom,
        name: subject.group.name,
        code: subject.group.code,
        day: session.day,
        hour: session.beginHour,
        color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
      }));
    });

    const maxDay = Math.max(4, ...cells.map((c) => c.day));
    const maxHour = Math.max(6, ...cells.map((c) => c.hour + c.duration));

    const scheduleMatrix: (ScheduleCell[] | null)[][] = Array.from(
      { length: maxHour },
      () => Array(maxDay + 1).fill(null),
    );

    for (const cell of cells) {
      for (let i = 0; i < cell.duration; i++) {
        if (scheduleMatrix[cell.hour + i][cell.day] === null) {
          scheduleMatrix[cell.hour + i][cell.day] = [];
        }
        scheduleMatrix[cell.hour + i][cell.day]!.push(cell);
      }
    }

    return { scheduleMatrix, maxDay };
  }, [schedule]);

  return (
    <div className="rounded-lg border">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 text-center font-bold">Hora</TableHead>
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((day, i) =>
              i <= maxDay ? (
                <TableHead key={day} className="text-center font-bold">
                  {day}
                </TableHead>
              ) : undefined,
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleMatrix.map((cellArr, index) => (
            <TableRow
              key={index}
              className={cn(index % 2 === 0 && "bg-secondary")}
            >
              <TableCell className="text-center">
                {formatHour(index)} - {formatHour(index + 1)}
              </TableCell>
              {cellArr.map((cells) => {
                if (cells === undefined) return;
                if (cells === null) return <TableCell></TableCell>;
                if (cells.length === 1) {
                  const cell = cells[0];
                  return (
                    <TableCell className="relative h-24 w-32 min-w-28">
                      <div
                        className={cn(
                          "absolute inset-1 flex flex-col justify-center rounded-lg p-2 text-xs text-wrap",
                          cell.color,
                        )}
                      >
                        <p className="line-clamp-2 font-bold">{cell.name}</p>
                        <p>{cell.code}</p>
                        <p>{cell.classroom}</p>
                      </div>
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell className="relative h-24 w-32 min-w-28">
                      <div
                        className={cn(
                          "absolute inset-1 flex flex-col justify-center rounded-lg p-2 text-xs text-wrap",
                          "bg-red-400",
                        )}
                      >
                        <p className="line-clamp-2 flex items-center font-bold">
                          {" "}
                          <TriangleAlert /> Conflicto de Materias
                        </p>
                        <p>{cells.map((c) => c.name).join(", ")}</p>
                      </div>
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
