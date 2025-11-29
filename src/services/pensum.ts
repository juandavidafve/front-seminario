import { api } from "@/lib/axios";
import type { Pensum } from "@/types/Pensum";

export async function getPensum() {
  const { data } = await api.get<Pensum>("/pensum");

  return data;
}

export async function savePensum(pensum: Pensum) {
  const requestData = { ...pensum, updateTeachers: true }; // Así para que actualice la información de maestros
  const response = await api.post("/pensum", requestData);
  return response.data;
}

export async function toogleSubjectViewed(id: string) {
  const response = await api.put(`/pensum/completed/${id}`);
  return response.data;
}
