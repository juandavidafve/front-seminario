import type { Workflow } from "@/types/Workflow";

let workflow: Workflow | null = null;

export async function createWorkflow() {
  // POST /workflow/start

  workflow = {
    uuid: "adaslkdlkasd",
    start: "2024-10-31 17:30:00",
    end: null,
    state: "PROCESSING",
    progress: 0,
    jobs: [],
  };

  return structuredClone(workflow);
}

export async function getWorkflowByUUID(uuid: string) {
  // GET /workflow/uuid

  if (!workflow) return createWorkflow();

  if (workflow.jobs.length > 1) {
    workflow.jobs[workflow.jobs.length - 1].state = "SUCCESS";
  }

  workflow.jobs.push({
    id: 123,
    number: 123,
    type: "PENSUM_INFO",
    state: "PENDING",
    response: "ola martes",
    description: "llamen a dios",
  });

  if (workflow.progress < 100) {
    workflow.progress += 10;
  } else if (workflow.progress === 100) {
    workflow.state = "SUCCESS";
    workflow.end = "2024-10-31 17:31:00";
  } else {
    workflow.state = "PROCESSING";
    workflow.progress = 0;
  }

  return structuredClone(workflow);
}

export async function getActiveWorkflows() {
  // GET /workflow/active

  if (workflow) return [structuredClone(workflow)];

  if (Math.random() < 0.5) {
    return [await createWorkflow()];
  }

  return [];
}
