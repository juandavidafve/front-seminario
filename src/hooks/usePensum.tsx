import { useEffect } from "react";

import { setPensum } from "@/redux/slices/pensumSlice";
import { getPensum } from "@/services/pensum";

import { useAppDispatch, useAppSelector } from "./redux";

export function usePensum() {
  const user = useAppSelector((state) => state.auth.user);
  const pensum = useAppSelector((state) => state.pensum.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (!user) return;
      if (pensum) return;

      dispatch(setPensum(await getPensum()));
    })();
  }, [user, pensum, dispatch]);
}
