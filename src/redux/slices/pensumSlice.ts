import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Pensum, Subject } from "@/schemas/Pensum";

interface PensumState {
  data: Pensum | null;
}

const initialState: PensumState = {
  data: null,
};

export const pensumSlice = createSlice({
  name: "pensum",
  initialState,
  reducers: {
    setPensum(state, action: PayloadAction<Pensum>) {
      state.data = action.payload;
    },

    insertSubject(state, action: PayloadAction<Subject>) {
      if (!state.data) return;

      state.data.subjects.push(action.payload);
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

      // Caso 1: el nuevo código es el mismo → solo actualizo
      if (subject.code === code) {
        state.data.subjects[oldIndex] = subject;
        return;
      }

      // Caso 2: el nuevo código ya está en uso por otro subject → error
      if (newIndex !== -1) {
        return;
      }

      // Caso 3: cambia el code y no hay conflicto → reemplazo
      state.data.subjects.splice(oldIndex, 1);
      state.data.subjects.push(subject);
    },

    removeSubject(state, action: PayloadAction<string>) {
      if (!state.data) return;
      state.data.subjects = state.data.subjects.filter(
        (s) => s.code !== action.payload,
      );
    },
  },
});

export const { setPensum, updateSubject, insertSubject, removeSubject } =
  pensumSlice.actions;

export default pensumSlice.reducer;
