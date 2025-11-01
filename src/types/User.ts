import type z from "zod";

import type { UserFormSchema, UserSchema } from "@/schemas/User";

export type User = z.infer<typeof UserSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
