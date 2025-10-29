"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import FormInputNumber from "@/components/ui/form-input-number";
import FormMultiSelector from "@/components/ui/form-multiselector";
import FormSelect from "@/components/ui/form-select";
import { useAppSelector } from "@/hooks/redux";
import { SubjectError } from "@/redux/errors/SubjectError";
import { SubjectSchema, type Subject } from "@/schemas/Pensum";

import GroupForm from "./GroupForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Subject;
  onSubmit: (values: Subject) => void;
}

export function SubjectForm({
  defaultValues,
  onSubmit,
  open,
  onOpenChange,
}: Props) {
  const subjects = useAppSelector((state) => state.pensum.data?.subjects);

  const defaults = useMemo<Subject>(
    () =>
      defaultValues ?? {
        id: 0,
        code: "",
        name: "",
        credits: 3,
        hours: 3,
        semester: 1,
        requiredCredits: 0,
        type: "MANDATORY",
        groups: [],
        requisites: [],
      },
    [defaultValues],
  );

  const form = useForm<Subject>({
    resolver: zodResolver(SubjectSchema),
  });

  const { control, handleSubmit, reset, setError, watch } = form;

  useEffect(() => {
    reset(defaults);
  }, [reset, defaults]);

  const semester = watch("semester");

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <AlertDialogContent className="max-h-[calc(100vh-var(--spacing)*8)] overflow-auto sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Materia</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((subject) => {
              try {
                onSubmit(subject);
                onOpenChange(false);
                reset();
              } catch (error) {
                if (error instanceof SubjectError) {
                  setError(error.path, {
                    type: "manual",
                    message: error.message,
                  });
                }
              }
            })}
            className="space-y-4"
          >
            <FormInput
              control={control}
              name="code"
              placeholder="1155805"
              label="Código"
            />

            <FormInput
              control={control}
              name="name"
              placeholder="Ingeniería de Software"
              label="Nombre"
            />

            <FormInputNumber
              control={control}
              name="credits"
              label="Créditos"
            />
            <FormInputNumber control={control} name="hours" label="Horas" />

            <FormInputNumber
              control={control}
              name="semester"
              label="Semestre"
            />

            <FormInputNumber
              control={control}
              name="requiredCredits"
              label="Créditos Requeridos"
            />

            <FormSelect
              control={control}
              items={[
                {
                  label: "Línea",
                  value: "MANDATORY",
                },
                {
                  label: "Electiva",
                  value: "ELECTIVE",
                },
                {
                  label: "Electiva Sociohumanística",
                  value: "SOCIOHUMANISTIC_ELECTIVE",
                },
                {
                  label: "Electiva Profesional",
                  value: "PROFESSIONAL_ELECTIVE",
                },
              ]}
              name="type"
              label="Tipo"
              itemLabel="label"
              itemValue="value"
            />

            {subjects && (
              <FormMultiSelector
                control={control}
                name="requisites"
                label="Requisitos"
                items={subjects
                  .filter((s) => {
                    return s.semester < semester;
                  })
                  .map((s) => ({
                    name: s.name,
                    code: s.code,
                  }))}
                itemLabel={(item) => item.name}
                itemValue={(item) => item.code}
              />
            )}

            <GroupForm control={control} />

            <AlertDialogFooter className="mt-8">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <Button type="submit">Guardar</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
