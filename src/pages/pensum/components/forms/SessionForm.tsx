import { Icon } from "@iconify/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";

import { Button } from "@/components/ui/button";
import { FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import { formatHour } from "@/lib/utils";
import type { Subject } from "@/types/Pensum";

interface Props {
  groupIndex: number;
}

export default function SessionForm({ groupIndex }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<Subject>();

  const {
    fields: sessions,
    append,
    remove,
  } = useFieldArray({
    name: `groups.${groupIndex}.sessions`,
  });

  const hourList = Array(17)
    .fill(0)
    .map((_, i) => {
      return {
        label: formatHour(i),
        value: i,
      };
    });

  const sessionErrors = errors.groups?.[groupIndex]?.sessions;
  return (
    <div className="mt-4 border-y pt-4">
      <div className="mb-2 flex items-center justify-between">
        <FormLabel>Horarios</FormLabel>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({
              day: 0,
              beginHour: 0,
              endHour: 1,
              classroom: "",
            })
          }
        >
          <Icon icon="material-symbols:add-2-rounded" />
          Añadir horario
        </Button>
      </div>

      <div className="mt-4 grid max-w-[calc(100vw-var(--spacing)*34)] grid-cols-[repeat(4,1fr)_auto] gap-2 overflow-auto pb-4">
        <span className="text-center font-medium">Día</span>
        <span className="text-center font-medium">Inicio</span>
        <span className="text-center font-medium">Fin</span>
        <span className="text-center font-medium">Aula</span>
        <Button size="icon" disabled variant="ghost"></Button>

        {sessions.map((session, sIndex) => (
          <Fragment key={session.id}>
            <FormSelect
              control={control}
              name={`groups.${groupIndex}.sessions.${sIndex}.day`}
              items={[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
              ].map((label, value) => ({
                label,
                value,
              }))}
              itemLabel="label"
              itemValue="value"
            />

            <FormSelect
              control={control}
              name={`groups.${groupIndex}.sessions.${sIndex}.beginHour`}
              items={hourList}
              itemLabel="label"
              itemValue="value"
            />

            <FormSelect
              control={control}
              name={`groups.${groupIndex}.sessions.${sIndex}.endHour`}
              items={hourList}
              itemLabel="label"
              itemValue="value"
            />

            <FormInput
              className="min-w-20"
              control={control}
              name={`groups.${groupIndex}.sessions.${sIndex}.classroom`}
            />

            <Button type="button" size="icon" onClick={() => remove(sIndex)}>
              <Icon
                icon="material-symbols:delete-outline-rounded"
                className="size-5"
              />
            </Button>

            {sessionErrors?.[sIndex] && (
              <FormMessage className="col-span-5">
                {sessionErrors[sIndex]?.message}
              </FormMessage>
            )}
          </Fragment>
        ))}
      </div>

      {sessionErrors?.root && (
        <FormMessage className="col-span-5">
          {sessionErrors?.root.message}
        </FormMessage>
      )}
    </div>
  );
}
