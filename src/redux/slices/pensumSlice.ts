import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Group, Pensum, Session, Subject } from "@/schemas/Pensum";

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
    // ======== GENERAL ========
    setPensum(state, action: PayloadAction<Pensum>) {
      state.data = action.payload;
    },
    clearPensum(state) {
      state.data = null;
    },

    // ======== SUBJECT CRUD ========
    addSubject(state, action: PayloadAction<Subject>) {
      if (!state.data) return;
      state.data.subjects.push(action.payload);
    },
    updateSubject(state, action: PayloadAction<Subject>) {
      if (!state.data) return;
      const index = state.data.subjects.findIndex(
        (s) => s.code === action.payload.code,
      );
      if (index !== -1) {
        state.data.subjects[index] = action.payload;
      }
    },
    removeSubject(state, action: PayloadAction<string>) {
      if (!state.data) return;
      state.data.subjects = state.data.subjects.filter(
        (s) => s.code !== action.payload,
      );
    },

    // ======== GROUP CRUD ========
    addGroup(
      state,
      action: PayloadAction<{ subjectCode: string; group: Group }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      if (subject) {
        subject.groups.push(action.payload.group);
      }
    },
    updateGroup(
      state,
      action: PayloadAction<{ subjectCode: string; group: Group }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      if (!subject) return;
      const index = subject.groups.findIndex(
        (g) => g.code === action.payload.group.code,
      );
      if (index !== -1) {
        subject.groups[index] = action.payload.group;
      }
    },
    removeGroup(
      state,
      action: PayloadAction<{ subjectCode: string; groupCode: string }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      if (subject) {
        subject.groups = subject.groups.filter(
          (g) => g.code !== action.payload.groupCode,
        );
      }
    },

    // ======== SESSION CRUD ========
    addSession(
      state,
      action: PayloadAction<{
        subjectCode: string;
        groupCode: string;
        session: Session;
      }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      const group = subject?.groups.find(
        (g) => g.code === action.payload.groupCode,
      );
      if (group) {
        group.sessions.push(action.payload.session);
      }
    },
    updateSession(
      state,
      action: PayloadAction<{
        subjectCode: string;
        groupCode: string;
        session: Session;
      }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      const group = subject?.groups.find(
        (g) => g.code === action.payload.groupCode,
      );
      if (!group) return;
      const index = group.sessions.findIndex(
        (sess) => sess.id === action.payload.session.id,
      );
      if (index !== -1) {
        group.sessions[index] = action.payload.session;
      }
    },
    removeSession(
      state,
      action: PayloadAction<{
        subjectCode: string;
        groupCode: string;
        sessionId: number;
      }>,
    ) {
      if (!state.data) return;
      const subject = state.data.subjects.find(
        (s) => s.code === action.payload.subjectCode,
      );
      const group = subject?.groups.find(
        (g) => g.code === action.payload.groupCode,
      );
      if (group) {
        group.sessions = group.sessions.filter(
          (sess) => sess.id !== action.payload.sessionId,
        );
      }
    },
  },
});

export const {
  setPensum,
  clearPensum,
  addSubject,
  updateSubject,
  removeSubject,
  addGroup,
  updateGroup,
  removeGroup,
  addSession,
  updateSession,
  removeSession,
} = pensumSlice.actions;

export default pensumSlice.reducer;
