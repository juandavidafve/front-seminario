import { type Control, type FieldValues, type Path } from "react-hook-form";

import { InputNumber } from "@/components/ui/input-number";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface FormInputNumberProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, unknown, T>;
  label?: string;
  min?: number;
  max?: number;
}

export default function FormInputNumber<T extends FieldValues>({
  name,
  control,
  label,
}: FormInputNumberProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputNumber {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
