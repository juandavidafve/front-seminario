import "@xyflow/react/dist/style.css";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setWorkflow } from "@/redux/slices/pensumSlice";
import { getActiveWorkflows } from "@/services/workflow";

import PensumManager from "./components/PensumManager";
import SubjectEnrollment from "./components/SubjectEnrollment";

export default function Pensum() {
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((state) =>
    state.auth.user?.roles.includes("ROLE_ADMIN"),
  );

  useEffect(() => {
    (async () => {
      if (!isAdmin) return;

      const workflows = await getActiveWorkflows();
      if (!Array.isArray(workflows)) return;

      if (workflows.length > 0) {
        dispatch(setWorkflow(workflows[0]));
      }
    })();
  }, [dispatch, isAdmin]);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Pensum</h1>

      <PensumManager />
      <SubjectEnrollment />
    </>
  );
}
