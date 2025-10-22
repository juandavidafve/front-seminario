import { Icon } from "@iconify/react";
import { useFieldArray, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import type { Subject } from "@/schemas/Pensum";

import SessionForm from "./SessionForm";

interface Props {
  control: Control<Subject, unknown, Subject>;
}

export default function GroupForm({ control }: Props) {
  const {
    fields: groups,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "groups",
  });

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel>Grupos</FormLabel>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({
              id: 0,
              code: "",
              teacher: "",
              program: "",
              maxCapacity: 30,
              availableCapacity: 30,
              sessions: [],
            })
          }
        >
          <Icon icon="material-symbols:add-2-rounded" />
          Añadir Grupo
        </Button>
      </div>
      {groups.map((_, index) => (
        <Card>
          <CardContent className="space-y-4">
            <FormInput
              control={control}
              name={`groups.${index}.code`}
              label="Código"
            />
            <FormInput
              control={control}
              name={`groups.${index}.teacher`}
              label="Docente"
            />
            <FormInput
              control={control}
              name={`groups.${index}.program`}
              label="Programa"
            />
            <FormInput
              control={control}
              name={`groups.${index}.maxCapacity`}
              label="Cupos"
            />
            <FormInput
              control={control}
              name={`groups.${index}.availableCapacity`}
              label="Disponible"
            />
            <SessionForm control={control} groupIndex={index} />
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={() => remove(index)}
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
      ))}
    </>
  );
}
