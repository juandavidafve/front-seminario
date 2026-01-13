import { api } from "@/lib/axios";
import type { Schedule } from "@/types/Schedule";

export async function getSchedules() {
  const { data } = await api.get<Schedule[]>("/schedule/my");
  return data;
}

export async function getScheduleById(id: number) {
  const { data } = await api.get<Schedule>(`/schedule/${id}`);
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

export async function updateTitle(scheduleId: number, title: string) {
  const { data } = await api.put<Schedule>(`/schedule/${scheduleId}`, {
    title,
  });
  return data;
}

export async function addSubject(scheduleId: number, subjectCode: string) {
  const { data } = await api.post<Schedule>(
    `/schedule/${scheduleId}/subject/${subjectCode}`,
  );
  return data;
}

export async function deleteGroup(scheduleId: number, groupCode: string) {
  const { data } = await api.delete<Schedule>(
    `/schedule/${scheduleId}/group/${groupCode}`,
  );
  return data;
}

export async function changeGroup(
  scheduleId: number,
  oldGroupCode: string,
  newGroupCode: string,
) {
  const { data } = await api.put<Schedule>(
    `/schedule/${scheduleId}/group/${oldGroupCode}`,
    {
      newCode: newGroupCode,
    },
  );
  return data;
}

export async function toggleFreemode(scheduleId: number) {
  const { data } = await api.patch<Schedule>(`/schedule/${scheduleId}`);

  return data;
}
