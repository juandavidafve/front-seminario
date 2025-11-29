import { useCallback, useEffect } from "react";

import { setPensum } from "@/redux/slices/pensumSlice";
import { getPensum } from "@/services/pensum";

import { useAppDispatch, useAppSelector } from "./redux";

let pensumFetching = false;

export function usePensum() {
  const user = useAppSelector((state) => state.auth.user);
  const pensum = useAppSelector((state) => state.pensum.data);
  const dispatch = useAppDispatch();

  const refresh = useCallback(async () => {
    const data = await getPensum();
    dispatch(setPensum(data));
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    if (pensum) return;
    if (pensumFetching) return;

    pensumFetching = true;

    (async () => {
      await refresh();
      pensumFetching = false;
    })();
  }, [user, pensum, refresh]);

  return { pensum, refresh };
}
