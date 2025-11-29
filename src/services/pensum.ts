import { api } from "@/lib/axios";
import type { Pensum } from "@/types/Pensum";

export async function getPensum() {
  const { data } = await api.get<Pensum>("/pensum");

  data.subjects = data.subjects.map((subject) => ({
    ...subject,
    isCritical: Math.random() <= 0.5,
    isCompleted: Math.random() <= 0.5,
    canEnroll: Math.random() <= 0.5,
  }));

  return data;
}

export async function savePensum(pensum: Pensum) {
  const requestData = { ...pensum, updateTeachers: true }; // Así para que actualice la información de maestros
  const response = await api.post("/pensum", requestData);
  return response.data;
}
