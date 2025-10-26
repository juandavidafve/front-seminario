// PensumGraphContainer.tsx
import { useState } from "react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  insertSubject,
  removeSubject,
  setPensum,
  updateSubject,
} from "@/redux/slices/pensumSlice";
import { type Subject } from "@/schemas/Pensum";
import { savePensum } from "@/services/pensum";

import { PensumGraph } from "./PensumGraph";
import { SubjectForm } from "./forms/SubjectForm";
import SubjectView from "./graph/SubjectView";

export default function PensumManager() {
  const dispatch = useAppDispatch();
  const pensum = useAppSelector((state) => state.pensum.data);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [formAction, setFormAction] = useState<(s: Subject) => void>(
    () => () => {},
  );

  async function handleSave() {
    const data = await savePensum(pensum!);
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

  return (
    <>
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
      <div className="h-[calc(100vh-var(--spacing)*48)] lg:h-[calc(100vh-var(--spacing)*32)]">
        <PensumGraph
          pensum={pensum}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
