import "@xyflow/react/dist/style.css";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { hasCompletedSubjectsSelector } from "@/redux/selectors/pensumSelectors";
import { setWorkflow } from "@/redux/slices/pensumSlice";
import { getActiveWorkflows } from "@/services/workflow";

import PensumManager from "./components/PensumManager";
import SubjectEnrollment from "./components/SubjectEnrollment";

export default function Pensum() {
  const dispatch = useAppDispatch();
  const hasCompletedSubjects = useAppSelector(hasCompletedSubjectsSelector);
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

      <div className="flex min-h-0 flex-col gap-6 md:h-[calc(100vh-8rem)] md:flex-row">
        {hasCompletedSubjects && (
          <div className="min-h-0 md:w-3/4">
            <PensumManager />
          </div>
        )}
        <div className="min-h-0 md:w-1/4">
          <SubjectEnrollment />
        </div>
      </div>
    </>
  );
}
