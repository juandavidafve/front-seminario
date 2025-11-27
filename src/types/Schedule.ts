import type { Group } from "./Pensum";

export interface Schedule {
  id: number;
  title: string;
  credits: number;
  subjectGroups: Group[];
}
