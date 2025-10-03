import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { ApiErrorSchema } from "@/schemas/Error";

import { BACKEND_BASE_URL } from "./config";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const accessToken = await user.getIdToken();
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(undefined, (error) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { data } = ApiErrorSchema.safeParse(error.response.data);

      if (data) {
        toast.error(data.message);
      }
    }
  }

  return Promise.reject(error);
});

export { api };
