import { Icon } from "@iconify/react";
import { useFieldArray, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import type { Subject } from "@/schemas/Pensum";

interface Props {
  control: Control<Subject, unknown, Subject>;
  groupIndex: number;
}

export default function SessionForm({ control, groupIndex }: Props) {
  const {
    fields: sessions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.sessions`,
  });

  const hourList = Array(17)
    .fill(0)
    .map((_, i) => {
      const h = i + 6;
      const hh = h > 9 ? h : `0${h}`; // Add leading zero

      return {
        label: `${hh}:00`,
        value: i,
      };
    });

  return (
    <div className="mt-4 border-y py-4">
      <div className="mb-2 flex items-center justify-between">
        <FormLabel>Horarios</FormLabel>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({
              id: 0,
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

      <div className="mt-4 grid grid-cols-[repeat(4,1fr)_auto] gap-2">
        <span className="text-center font-medium">Día</span>
        <span className="text-center font-medium">Inicio</span>
        <span className="text-center font-medium">Fin</span>
        <span className="text-center font-medium">Aula</span>
        <Button size="icon" disabled variant="ghost"></Button>

        {sessions.map((_, sIndex) => (
          <>
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
              control={control}
              name={`groups.${groupIndex}.sessions.${sIndex}.classroom`}
            />

            <Button type="button" size="icon" onClick={() => remove(sIndex)}>
              <Icon
                icon="material-symbols:delete-outline-rounded"
                className="size-5"
              />
            </Button>
          </>
        ))}
      </div>
    </div>
  );
}
