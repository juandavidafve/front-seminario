import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { update } from "@/redux/slices/authSlice";
import { UserFormSchema, type UserForm } from "@/schemas/User";
import { setAccountInfo } from "@/services/user";

export default function DatosPersonales() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
  });

  async function onSubmit(values: UserForm) {
    try {
      setLoading(true);
      const updatedValues = await setAccountInfo(values);
      dispatch(update(updatedValues));
      toast.success("Información actualizada correctamente.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Datos Personales</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-2"
        >
          <FormInput
            control={form.control}
            name="email"
            label="Correo electrónico"
            disabled
          />
          <FormInput control={form.control} name="name" label="Nombre" />
          <Button type="submit" className="w-fit" disabled={loading}>
            Guardar
          </Button>
        </form>
      </Form>
    </>
  );
}
