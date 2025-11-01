// src/middlewares/subjectValidationMiddleware.ts
import type { Middleware } from "@reduxjs/toolkit";

import type { Pensum, Subject } from "@/types/Pensum";

import { SubjectError } from "../errors/SubjectError";
import { insertSubject, updateSubject } from "../slices/pensumSlice";

function subjectCodeExists(code: string, pensumSubjects: Subject[]) {
  return pensumSubjects.some((s) => s.code === code);
}

// ------------------------------------------------------
// 🧠 Funciones de validación
// ------------------------------------------------------

/**
 * Verifica que el código de la materia no esté duplicado.
 */
function validateNotExistingSubjectCode(
  code: string,
  pensumSubjects: Subject[],
) {
  if (subjectCodeExists(code, pensumSubjects)) {
    throw new SubjectError("El código ya está en uso", "code");
  }
}

/**
 * Verifica que el código a actualizar exista en el pensum.
 */
function validateExistingSubjectCode(code: string, pensumSubjects: Subject[]) {
  if (!subjectCodeExists(code, pensumSubjects)) {
    throw new SubjectError("El código no existe", "code");
  }
}

/**
 * Verifica que el nuevo código (en actualización) no choque con otro existente.
 */
function validateUpdatedSubjectCode(
  newCode: string,
  oldCode: string,
  pensumSubjects: Subject[],
) {
  if (newCode !== oldCode) {
    if (subjectCodeExists(newCode, pensumSubjects)) {
      throw new SubjectError("El nuevo código ya está en uso", "code");
    }
  }
}

/**
 * Verifica que ningún grupo tenga códigos duplicados en todo el pensum.
 */
function validateUniqueGroupCodes(subject: Subject, pensumSubjects: Subject[]) {
  const otherSubjectsGroupCodes = pensumSubjects
    .filter((s) => s.code !== subject.code)
    .flatMap((s) => s.groups.map((g) => g.code));

  const subjectGroupCodes = new Set<string>();

  for (let i = 0; i < subject.groups.length; i++) {
    const group = subject.groups[i];
    subjectGroupCodes.add(group.code);

    if (
      otherSubjectsGroupCodes.includes(group.code) ||
      subjectGroupCodes.size - 1 < i
    ) {
      throw new SubjectError(
        `El código de grupo "${group.code}" ya está en uso.`,
        `groups.${i}.code`,
      );
    }
  }
}

function validateSemester(subject: Subject, pensum: Pensum) {
  if (subject.semester > pensum.semesters) {
    throw new SubjectError(
      `El semestre no puede ser mayor a ${pensum.semesters}`,
      "semester",
    );
  }
}

// ------------------------------------------------------
// ⚙️ Middleware principal
// ------------------------------------------------------

export const subjectValidationMiddleware: Middleware =
  (store) => (next) => (action) => {
    const state = store.getState();
    const pensum = state.pensum.data;

    if (!pensum) return next(action);

    // --- Al insertar ---
    if (insertSubject.match(action)) {
      const subject = action.payload;

      validateNotExistingSubjectCode(subject.code, pensum.subjects);
      validateUniqueGroupCodes(subject, pensum.subjects);
      validateSemester(subject, pensum);
    }

    // --- Al actualizar ---
    if (updateSubject.match(action)) {
      const subject = action.payload.subject;
      const oldCode = action.payload.code;
      const newCode = subject.code;

      validateExistingSubjectCode(oldCode, pensum.subjects);
      validateUpdatedSubjectCode(newCode, oldCode, pensum.subjects);
      validateUniqueGroupCodes(subject, pensum.subjects);
      validateSemester(subject, pensum);
    }

    return next(action);
  };
