import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface FormSelectProps<T extends FieldValues, U> {
  name: Path<T>;
  control: Control<T, unknown, T>;
  label?: string;
  items: U[];
  itemLabel?: keyof U;
  itemValue?: keyof U;
}

export default function FormSelect<T extends FieldValues, U>({
  name,
  control,
  label,
  items,
  itemLabel,
  itemValue,
}: FormSelectProps<T, U>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value !== undefined ? String(field.value) : ""}
              onValueChange={(value) => {
                const valNum = parseInt(value);
                field.onChange(isNaN(valNum) ? value : valNum);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem
                    key={String(itemValue ? item[itemValue] : item)}
                    value={String(itemValue ? item[itemValue] : item)}
                  >
                    {String(itemLabel ? item[itemLabel] : item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
