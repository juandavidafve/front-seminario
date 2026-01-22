import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { Link } from "react-router";

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
      <div className="mb-8 flex items-center">
        <h1 className="me-4 text-2xl font-bold">Pensum </h1>
        <Link to={"/pensum/changelog"}>
          <h2 className="text-l underline">Ver cambios</h2>
        </Link>
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
      </div>
    </>
  );
}
