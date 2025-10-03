import { api } from "@/lib/axios";
import { UserSchema, type UserForm } from "@/schemas/User";

const base = "/user";

export async function getAccountInfo() {
  const req = await api.get(base + "/my");

  return UserSchema.parse(req.data);
}

export async function setAccountInfo(data: UserForm) {
  const req = await api.put(base, data);

  return UserSchema.parse(req.data);
}
