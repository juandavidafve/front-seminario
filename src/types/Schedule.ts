import type { Session } from "./Pensum";

export interface Schedule {
  id: number;
  title: string;
  credits: number;
  freeMode: boolean;
  subjects: {
    group: ScheduleGroup;
    messages: ScheduleMsg[];
  }[];
}

export interface ScheduleGroup {
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
