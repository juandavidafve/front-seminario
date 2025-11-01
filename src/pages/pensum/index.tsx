import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { useAsync } from "react-async-hook";

import { useAppDispatch } from "@/hooks/redux";
import { setPensum, setWorkflow } from "@/redux/slices/pensumSlice";
import { getPensum } from "@/services/pensum";
import { getActiveWorkflows } from "@/services/workflow";

import PensumManager from "./components/PensumManager";

export default function Pensum() {
  const dispatch = useAppDispatch();
  const activeWorkflowsReq = useAsync(getActiveWorkflows, []);
  const pensumReq = useAsync(getPensum, []);

  useEffect(() => {
    if (pensumReq.result) {
      dispatch(setPensum(pensumReq.result));
    }
  }, [pensumReq.result, dispatch]);

  useEffect(() => {
    const workflows = activeWorkflowsReq.result;
    if (!Array.isArray(workflows)) return;

    if (workflows.length > 0) {
      dispatch(setWorkflow(workflows[0]));
    }
  }, [activeWorkflowsReq.result, dispatch]);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Pensum</h1>

      <PensumManager />
    </>
  );
}
