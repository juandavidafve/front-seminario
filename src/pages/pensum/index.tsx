import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { useAsync } from "react-async-hook";

import { useAppDispatch } from "@/hooks/redux";
import { setPensum } from "@/redux/slices/pensumSlice";
import { getPensum } from "@/services/pensum";

import PensumManager from "./components/PensumManager";

export default function Pensum() {
  const dispatch = useAppDispatch();
  const pensumReq = useAsync(getPensum, []);

  useEffect(() => {
    if (pensumReq.result) {
      dispatch(setPensum(pensumReq.result));
    }
  }, [pensumReq, dispatch]);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Pensum</h1>

      <PensumManager />
    </>
  );
}
