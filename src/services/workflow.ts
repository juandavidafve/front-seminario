import { api } from "@/lib/axios";

export async function createWorkflow() {
  // POST /workflow/start

  const response = await api.post("/api/workflow/workflow/start");

  return response.data;
}

export async function getWorkflowByUUID(uuid: string) {
  // GET /workflow/uuid

  const response = await api.get(`/api/workflow/workflow/${uuid}`);

  return response.data;
}

export async function getActiveWorkflows() {
  console.log("GET ACTIVE WORKFLOWS");
  // GET /workflow/active

  const response = await api.get("/api/workflow/workflow/active");

  return response.data;
}
