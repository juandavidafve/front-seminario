"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import FormInputNumber from "@/components/ui/form-input-number";
import FormMultiSelector from "@/components/ui/form-multiselector";
import FormSelect from "@/components/ui/form-select";
import { useAppSelector } from "@/hooks/redux";
import { SubjectSchema } from "@/schemas/Pensum";

import GroupForm from "./GroupForm";

type SubjectFormValues = z.infer<typeof SubjectSchema>;

export function SubjectForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<SubjectFormValues>;
  onSubmit: (values: SubjectFormValues) => void;
}) {
  const subjects = useAppSelector((state) => state.pensum.data?.subjects);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: defaultValues ?? {
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
  });

  const { control, handleSubmit } = form;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Formulario de Asignatura</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormInputNumber
                control={control}
                name="credits"
                label="Créditos"
              />
              <FormInputNumber control={control} name="hours" label="Horas" />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                items={subjects.map((s) => ({
                  id: s.id,
                  name: s.name,
                  code: s.code,
                }))}
                itemLabel={(item) => item.name}
                itemValue={(item) => item.code}
              />
            )}

            <GroupForm control={control} />

            <Button type="submit" className="w-full">
              Guardar Materia
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
