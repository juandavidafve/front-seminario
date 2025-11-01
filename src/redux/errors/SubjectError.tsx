import type { Path } from "react-hook-form";

import type { Subject } from "@/types/Pensum";

export class SubjectError extends Error {
  path: Path<Subject>;

  constructor(message: string, path: Path<Subject>) {
    super(message);
    this.name = "SubjectError";
    this.path = path;

    // Necesario para herencia correcta en TypeScript
    Object.setPrototypeOf(this, SubjectError.prototype);
  }
}
