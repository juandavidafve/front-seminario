import { z } from "zod";

export const UserSchema = z.object({
  uid: z.string(),
  email: z.email(),
  name: z.string(),
  roles: z.enum(["ROLE_USER", "ROLE_ADMIN"]).array(),
});

export const UserFormSchema = UserSchema.pick({
  email: true,
  name: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
