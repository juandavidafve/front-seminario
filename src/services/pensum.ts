import { api } from "@/lib/axios";
import { type Pensum } from "@/schemas/Pensum";

export async function getPensum() {
  const response = await api.get("/pensum");

  const data: Pensum = response.data;

  return data;
}

export async function savePensum(pensum: Pensum) {
  const requestData = { ...pensum, updateTeachers: true }; // Así para que actualice la información de maestros
  const response = await api.post("/pensum", requestData);
  return response.data;
}
