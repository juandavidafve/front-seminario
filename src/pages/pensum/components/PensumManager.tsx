// PensumGraphContainer.tsx
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmLeaveDialog } from "@/components/ConfirmLeaveDialog";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useNavigationBlocker } from "@/hooks/useNavigationBlocker";
import {
  insertSubject,
  removeSubject,
  setPensum,
  setWorkflow,
  updateSubject,
} from "@/redux/slices/pensumSlice";
import { savePensum } from "@/services/pensum";
import { createWorkflow } from "@/services/workflow";
import { type Subject } from "@/types/Pensum";

import SubjectView from "./SubjectView";
import WorkflowView from "./WorkflowView";
import { SubjectForm } from "./forms/SubjectForm";
import { PensumGraph } from "./graph/PensumGraph";

export default function PensumManager() {
  const dispatch = useAppDispatch();
  const pensum = useAppSelector((state) => state.pensum.data);
  const workflow = useAppSelector((state) => state.pensum.workflow);
  const hasChanged = useAppSelector((state) => state.pensum.hasChanged);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [formAction, setFormAction] = useState<(s: Subject) => void>(
    () => () => {},
  );

  const {
    showDialog: showLeaveDialog,
    confirmNavigation,
    cancelNavigation,
  } = useNavigationBlocker(hasChanged);

  async function handleSave() {
    if (!pensum) return;

    const data = await savePensum(pensum);
    dispatch(setPensum(data));
    toast.success("Pensum actualizado correctamente");
  }

  const handleAdd = () => {
    setSelectedSubject(undefined);
    setFormAction(() => (s: Subject) => dispatch(insertSubject(s)));
    setShowForm(true);
  };

  const handleView = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowDetails(true);
  };

  const handleEdit = (subject: Subject) => {
    const { code } = subject;
    setSelectedSubject(subject);
    setFormAction(
      () => (s: Subject) => dispatch(updateSubject({ subject: s, code })),
    );
    setShowForm(true);
  };

  const handleDelete = (subject: Subject) => {
    dispatch(removeSubject(subject.code));
  };

  async function handleWorkflow() {
    if (!workflow) {
      const data = await createWorkflow();
      dispatch(setWorkflow(data));
    }

    setShowWorkflow(true);
  }

  return (
    <>
      <ConfirmLeaveDialog
        open={showLeaveDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <SubjectForm
        onSubmit={formAction}
        onOpenChange={setShowForm}
        open={showForm}
        defaultValues={selectedSubject}
      />
      <SubjectView
        subject={selectedSubject}
        onOpenChange={setShowDetails}
        open={showDetails}
      />
      <WorkflowView open={showWorkflow} onOpenChange={setShowWorkflow} />
      <div className="h-[calc(100vh-var(--spacing)*48)] lg:h-[calc(100vh-var(--spacing)*32)]">
        <PensumGraph
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSave}
          onWorkflow={handleWorkflow}
        />
      </div>
    </>
  );
}
