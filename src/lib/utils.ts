import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatHour(index: number) {
  const hour = 6 + index;
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function dayName(index: number) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[index] ?? "Desconocido";
}
