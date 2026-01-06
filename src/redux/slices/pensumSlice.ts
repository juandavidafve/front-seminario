import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Pensum, Subject } from "@/types/Pensum";
import type { Workflow } from "@/types/Workflow";

interface PensumState {
  data: Pensum | null;
  hasChanged: boolean;
  workflow: Workflow | null;
}

const initialState: PensumState = {
  data: null,
  hasChanged: false,
  workflow: null,
};

export const pensumSlice = createSlice({
  name: "pensum",
  initialState,
  reducers: {
    setPensum(state, action: PayloadAction<Pensum>) {
      state.data = action.payload;
      state.hasChanged = false;
    },

    insertSubject(state, action: PayloadAction<Subject>) {
      if (!state.data) return;

      state.data.subjects.push(action.payload);

      if (action.payload.semester > state.data.semesters) {
        state.data.semesters = action.payload.semester;
      }

      state.hasChanged = true;
    },

    updateSubject(
      state,
      action: PayloadAction<{ subject: Subject; code: string }>,
    ) {
      if (!state.data) return;

      const { subject, code } = action.payload;

      // Buscar el índice del subject original (por code anterior)
      const oldIndex = state.data.subjects.findIndex((s) => s.code === code);

      if (oldIndex === -1) {
        return;
      }

      // Verificar si el nuevo code ya existe en otro subject
      const newIndex = state.data.subjects.findIndex(
        (s) => s.code === subject.code,
      );

      // El code cambio y ya se encuentra en uso por otro subject
      if (subject.code !== code && newIndex !== -1) {
        return;
      }

      if (subject.code === code) {
        state.data.subjects[oldIndex] = subject;
      } else {
        state.data.subjects.splice(oldIndex, 1);
        state.data.subjects.push(subject);
      }

      state.data.semesters = Math.max(
        ...state.data.subjects.map((s) => s.semester),
      );
      state.hasChanged = true;
    },

    removeSubject(state, action: PayloadAction<string>) {
      if (!state.data) return;
      state.data.subjects = state.data.subjects.filter(
        (s) => s.code !== action.payload,
      );
      state.hasChanged = true;
    },

    setWorkflow(state, action: PayloadAction<Workflow>) {
      state.workflow = action.payload;
    },

    clearWorkflow(state) {
      state.workflow = null;
    },
  },
});

export const {
  setPensum,
  updateSubject,
  insertSubject,
  removeSubject,
  setWorkflow,
  clearWorkflow,
} = pensumSlice.actions;

export default pensumSlice.reducer;
