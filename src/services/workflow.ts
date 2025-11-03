import { api } from "@/lib/axios";
import type { Workflow } from "@/types/Workflow";

export async function createWorkflow() {
  const response = await api.post<Workflow>("/api/workflow/workflow/start");

  return response.data;
}

export async function getWorkflowByUUID(uuid: string) {
  const response = await api.get<Workflow>(`/api/workflow/workflow/${uuid}`);

  return response.data;
}

export async function getActiveWorkflows() {
  const response = await api.get<Workflow[]>("/api/workflow/workflow/active");

  return response.data;
}
