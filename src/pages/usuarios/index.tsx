import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { Switch } from "@/components/ui/switch";

export default function Usuarios() {
  const formSchema = z.object({
    query: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const users = [
    {
      name: "Juan David Afanador",
      email: "juanafanador07@gmail.com",
      admin: true,
    },
    {
      name: "Kevin",
      email: "gatitagolosa69@gmail.com",
      admin: false,
    },
  ];

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Datos Personales</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-[1fr_auto] items-end gap-4"
        >
          <FormInput
            control={form.control}
            name="query"
            label="Nombre o Correo"
            placeholder="usuario@ufps.edu.co"
          />
          <Button type="submit" className="w-fit">
            Buscar
          </Button>
        </form>
      </Form>

      <div className="my-6 space-y-4">
        {users.map((user) => {
          return (
            <Card>
              <CardContent className="grid grid-cols-[auto_1fr_auto] gap-4">
                <Icon
                  icon="material-symbols:person-outline-rounded"
                  className="size-12 text-primary"
                />
                <div>
                  <h2 className="font-bold">{user.name}</h2>
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  Admin
                  <Switch checked={user.admin} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
