import { type Control, type FieldValues, type Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import MultiSelector from "@/components/ui/multiselector";

interface Props<T extends FieldValues, U> {
  name: Path<T>;
  control: Control<T, unknown, T>;
  label?: string;
  items: U[];
  itemValue: (item: U) => string | number;
  itemLabel: (item: U) => string;
}

export default function FormMultiSelector<T extends FieldValues, U>({
  name,
  control,
  label,
  items,
  itemLabel,
  itemValue,
}: Props<T, U>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <MultiSelector
              value={field.value}
              items={items}
              itemLabel={itemLabel}
              itemValue={itemValue}
              onChange={(value) => field.onChange(value)}
              className="w-full"
              label={label || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
