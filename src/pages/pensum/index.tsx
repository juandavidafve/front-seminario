import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { hasCompletedSubjectsSelector } from "@/redux/selectors/pensumSelectors";
import { setWorkflow } from "@/redux/slices/pensumSlice";
import { getActiveWorkflows } from "@/services/workflow";

import ChangeLog from "./changelog";
import PensumManager from "./components/PensumManager";
import SubjectEnrollment from "./components/SubjectEnrollment";

export default function Pensum() {
  const dispatch = useAppDispatch();
  const hasCompletedSubjects = useAppSelector(hasCompletedSubjectsSelector);
  const isAdmin = useAppSelector((state) =>
    state.auth.user?.roles.includes("ROLE_ADMIN"),
  );
  const [openChangelog, setOpenChangelog] = useState<boolean>(false);

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
      <div className="mb-8 flex items-center">
        <h1 className="me-4 text-2xl font-bold">Pensum </h1>
        {isAdmin && (
          <h2
            onClick={() => setOpenChangelog(!openChangelog)}
            className="text-l mt-1 cursor-pointer underline"
          >
            Ver cambios
          </h2>
        )}
      </div>

      <div className="flex min-h-0 flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:flex-row">
        {hasCompletedSubjects && (
          <div className="min-h-0 lg:w-3/4">
            <PensumManager />
          </div>
        )}
        <div className="min-h-0 lg:w-1/4">
          <SubjectEnrollment />
        </div>
        <ChangeLog onOpenChange={setOpenChangelog} open={openChangelog} />
      </div>
    </>
  );
}
