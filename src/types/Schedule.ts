import type { Session } from "./Pensum";

export interface Schedule {
  id: number;
  title: string;
  credits: number;
  subjects: {
    group: ScheduleGroup;
    messages: ScheduleMsg[];
  }[];
}

interface ScheduleGroup {
  name: string;
  teacher: string;
  code: string;
  subjectCode: string;
  credits: number;
  sessions: Session[];
}

interface ScheduleMsg {
  type: "INFO" | "WARNING" | "ERROR";
  message: "string";
}
