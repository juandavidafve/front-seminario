import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { useAppSelector } from "@/hooks/redux";

export default function DatosPersonales() {
  const formSchema = z.object({
    email: z.email(),
    name: z.string().min(3),
  });

  const user = useAppSelector((state) => state.auth.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email,
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
          <Button type="submit" className="w-fit">
            Guardar
          </Button>
        </form>
      </Form>
    </>
  );
}
