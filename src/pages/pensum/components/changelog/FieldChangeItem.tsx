import { ArrowRight } from "lucide-react";

import { dayName, formatHour } from "@/lib/utils";
import type { FieldChange } from "@/types/Changelog";

interface FieldChangeItemProps {
  fieldName: string;
  change: FieldChange;
}

// Traducciones de nombres de campos
const fieldTranslations: Record<string, string> = {
  name: "Nombre",
  teacher: "Profesor",
  classroom: "Salón",
  credits: "Créditos",
  requisites: "Horarios",
  prerequisites: "Prerrequisitos",
  day: "Día",
  beginHour: "Hora inicio",
  endHour: "Hora fin",
  maxCapacity: "Cupos máximos",
  availableCapacity: "Cupos disponibles",
};

function translateFieldName(field: string): string {
  return fieldTranslations[field] || field;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    // Si es un array de objetos (como horarios)
    if (typeof value[0] === "object") {
      return `${value.length} elemento${value.length > 1 ? "s" : ""}`;
    }
    return value.map(formatValue).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function renderDetailedChange(oldValue: unknown, newValue: unknown) {
  // Si son arrays de objetos, mostrar comparación detallada
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length === 0 && newValue.length > 0) {
      return (
        <div className="text-xs">
          <span className="font-medium text-green-600">
            Agregados {newValue.length} elemento(s)
          </span>
        </div>
      );
    }
    if (oldValue.length > 0 && newValue.length === 0) {
      return (
        <div className="text-xs">
          <span className="font-medium text-red-600">
            Eliminados {oldValue.length} elemento(s)
          </span>
        </div>
      );
    }

    // Mostrar arrays lado a lado si son objetos (como horarios)
    if (typeof oldValue[0] === "object" && typeof newValue[0] === "object") {
      return (
        <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-red-50 p-2 dark:bg-red-950/20">
            <div className="mb-1 font-medium text-red-700 dark:text-red-400">
              Anterior:
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {oldValue.map((s, i) => (
                <li key={i}>
                  {dayName(s.day)} — {formatHour(s.beginHour)} a{" "}
                  {formatHour(s.endHour)} ({s.classroom})
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded bg-green-50 p-2 dark:bg-green-950/20">
            <div className="mb-1 font-medium text-green-700 dark:text-green-400">
              Nuevo:
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {newValue.map((s, i) => (
                <li key={i}>
                  {dayName(s.day)} — {formatHour(s.beginHour)} a{" "}
                  {formatHour(s.endHour)} ({s.classroom})
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }

  return null;
}

export function FieldChangeItem({ fieldName, change }: FieldChangeItemProps) {
  const translatedName = translateFieldName(fieldName);
  const oldValueStr = formatValue(change.oldValue);
  const newValueStr = formatValue(change.newValue);
  const detailedView = renderDetailedChange(change.oldValue, change.newValue);

  return (
    <div className="rounded-sm border-l-2 border-primary/30 bg-background px-2 py-1.5">
      <div className="flex items-start gap-2 text-xs">
        <span className="min-w-[80px] font-medium text-muted-foreground">
          {translatedName}:
        </span>
        {!detailedView ? (
          <div className="flex flex-1 items-center gap-1.5">
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              {oldValueStr}
            </span>
            <ArrowRight className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-950/30 dark:text-green-400">
              {newValueStr}
            </span>
          </div>
        ) : null}
      </div>
      {detailedView}
    </div>
  );
}
