import type { RootState } from "../store";

export function hasCompletedSubjectsSelector(state: RootState) {
  if (!state.pensum.data) return false;

  return state.pensum.data.subjects.filter((s) => s.isCompleted).length > 0;
}
