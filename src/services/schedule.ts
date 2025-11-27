import { api } from "@/lib/axios";
import type { Schedule } from "@/types/Schedule";

export async function getSchedules() {
  const { data } = await api.get<Schedule[]>("/schedule/my");
  return data;
}

export async function createSchedule(title: string) {
  const { data } = await api.post<Schedule>("/schedule", { title });

  return data;
}

export async function duplicateSchedule(id: number) {
  const { data } = await api.post<Schedule>(`/schedule/duplicate/${id}`);
  return data;
}

export async function deleteSchedule(id: number) {
  await api.delete(`/schedule/${id}`);
}
