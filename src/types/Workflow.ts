export type Workflow = {
  uuid: string;
  start: string;
  end: string | null;
  state: "PROCESSING" | "ERROR" | "SUCCESS" | "STOPPED";
  progress: number;
  jobs: Job[];
};

export type Job = {
  id: number;
  number: number;
  type: "PENSUM_INFO" | "SUBJECT_INFO" | "EQUIVALENCE_INFO";
  state: "PENDING" | "ERROR" | "SUCCESS";
  response: "ola martes";
  description: "llamen a dios";
};
