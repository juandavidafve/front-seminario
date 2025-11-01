"use client";

import { Icon } from "@iconify/react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import type { Subject } from "@/types/Pensum";

// ⬅️ importa tu tipo inferido de Zod aquí

// 👇 Tipado explícito de las props
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject;
}

export default function SubjectView({ open, onOpenChange, subject }: Props) {
  if (!subject) return;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-screen overflow-y-auto sm:max-w-xl [&>button:first-of-type]:hidden"
      >
        <SheetHeader>
          <div className="flex items-center justify-between gap-5">
            <SheetTitle className="flex items-center gap-4 text-xl">
              <Icon
                icon="material-symbols:book-2-outline-rounded"
                className="size-8 text-primary"
              />
              {subject.name}
            </SheetTitle>
            <SheetClose asChild={true}>
              <Button size="icon" variant="ghost">
                <Icon icon="material-symbols:close-rounded" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>
            {subject.code} -{" "}
            <Badge variant="secondary" className="uppercase">
              {
                {
                  MANDATORY: "Línea",
                  ELECTIVE: "Electiva",
                  SOCIOHUMANISTIC_ELECTIVE: "Electiva Sociohumanística",
                  PROFESSIONAL_ELECTIVE: "Electiva Profesional",
                }[subject.type]
              }
            </Badge>
          </SheetDescription>
        </SheetHeader>
        <div className="mx-4 mb-4 space-y-4">
          <div className="grid grid-cols-4">
            {[
              {
                label: "Créditos",
                value: subject.credits,
              },
              {
                label: "Horas",
                value: subject.hours,
              },
              {
                label: "Semestre",
                value: subject.semester,
              },
              {
                label: "Requiere",
                value: `${subject.requiredCredits} créditos`,
                show: subject.requiredCredits > 0,
              },
            ].map((item) => {
              if (item.show === false) return;

              return (
                <div className="flex flex-col" key={item.label}>
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-medium">{item.value}</span>
                </div>
              );
            })}
          </div>

          <Separator />

          {subject.requisites?.length > 0 && (
            <>
              <div>
                <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Icon
                    icon="material-symbols:layers-outline-rounded"
                    className="size-6 text-primary"
                  />
                  Requisitos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subject.requisites.map((req) => (
                    <Badge key={req.code} variant="outline">
                      {req.name} ({req.code})
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Grupos */}
          {subject.groups?.length > 0 ? (
            <div>
              <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Icon
                  icon="material-symbols:group-outline-rounded"
                  className="size-6 text-primary"
                />
                Grupos disponibles
              </h3>

              <Accordion type="single" collapsible className="w-full space-y-2">
                {subject.groups.map((group) => (
                  <AccordionItem
                    key={group.code}
                    value={group.code}
                    className="rounded-lg border bg-accent px-3"
                  >
                    <AccordionTrigger className="text-left font-medium">
                      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                        <span>
                          {group.code} — {group.teacher}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Cupos disponibles: {group.availableCapacity}/
                          {group.maxCapacity}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="space-y-2 text-sm">
                      {group.program !== "115" && (
                        <Badge variant="outline">Equivalencia</Badge>
                      )}

                      {/* Sesiones */}
                      <div>
                        <h4 className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                          <Icon
                            icon="material-symbols:calendar-month-outline-rounded"
                            className="size-6 text-primary"
                          />
                          Horarios
                        </h4>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          {group.sessions.map((s, i) => (
                            <li key={i}>
                              {dayName(s.day)} — {formatHour(s.beginHour)} a{" "}
                              {formatHour(s.endHour)} ({s.classroom})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay grupos disponibles para esta materia.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* --- Helpers --- */

function formatHour(index: number) {
  const hour = 6 + index;
  return `${hour.toString().padStart(2, "0")}:00`;
}

function dayName(index: number) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[index] ?? "Desconocido";
}
