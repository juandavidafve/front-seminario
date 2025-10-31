import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import FormInputNumber from "@/components/ui/form-input-number";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subject } from "@/schemas/Pensum";

import SessionForm from "./SessionForm";

export default function GroupForm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<Subject>();

  const { append, remove } = useFieldArray({
    control,
    name: "groups",
  });

  const groups = watch("groups");

  const [groupIndex, setGroupIndex] = useState<number>(
    groups.length > 0 ? 0 : -1,
  );

  async function addGroup() {
    const group = {
      code: "",
      teacher: "",
      program: "",
      maxCapacity: 30,
      availableCapacity: 30,
      sessions: [],
    };

    append(group);
    setGroupIndex(groups.length);
  }

  async function selectChange(value: string) {
    if (value.length === 0) return;
    setGroupIndex(Number(value));
  }

  async function deleteGroup(groupIndex: number) {
    setGroupIndex(groups.length - 2);
    remove(groupIndex);
  }

  useEffect(() => {
    if (Array.isArray(errors.groups) && errors.groups.length > 0) {
      setGroupIndex(errors.groups.length - 1);
    }
  }, [errors]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel>Grupos y Equivalencias</FormLabel>
        <Button type="button" size="sm" onClick={addGroup}>
          <Icon icon="material-symbols:add-2-rounded" />
          Añadir Grupo
        </Button>
      </div>
      {groups.length > 0 && groupIndex !== -1 && (
        <>
          <Select value={String(groupIndex)} onValueChange={selectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Grupo..." />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group, index) => (
                <SelectItem key={index} value={String(index)}>
                  {group.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Card key={groupIndex}>
            <CardContent className="space-y-4">
              <FormInput
                control={control}
                name={`groups.${groupIndex}.code`}
                label="Código"
              />
              <FormInput
                control={control}
                name={`groups.${groupIndex}.teacher`}
                label="Docente"
              />

              <FormInputNumber
                control={control}
                name={`groups.${groupIndex}.maxCapacity`}
                label="Cupos"
              />
              <FormInputNumber
                control={control}
                name={`groups.${groupIndex}.availableCapacity`}
                label="Disponible"
              />
              <SessionForm groupIndex={groupIndex} />
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                onClick={() => deleteGroup(groupIndex)}
                className="w-full"
              >
                <Icon
                  icon="material-symbols:delete-outline-rounded"
                  className="size-6"
                />
                <span>Eliminar Grupo</span>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
