import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

interface FormInputProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  control: Control<T, unknown, T>;
  label?: string;
  description?: string;
}

export default function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...props
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          {description && (
            <FormDescription>This is your public display name.</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
