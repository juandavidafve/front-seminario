import { z } from "zod";

export const UserSchema = z.object({
  uid: z.string(),
  email: z.email(),
  name: z.string().nonempty("El nombre no puede estar vacío"),
  roles: z.enum(["ROLE_USER", "ROLE_ADMIN"]).array(),
});

export const UserFormSchema = UserSchema.pick({
  email: true,
  name: true,
});
