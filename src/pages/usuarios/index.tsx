import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form-input";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/schemas/User";
import { getUsers, toggleAdmin } from "@/services/user";

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const usersReq = useAsync(getUsers, []);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    if (usersReq.result !== undefined) {
      setUsers(usersReq.result);
    }
  }, [usersReq.result]);

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
    setFilterQuery(values.query);
  }

  async function handleToggleAdmin(user: User) {
    await toggleAdmin(user.uid);
    usersReq.execute();
  }

  const filteredUsers = users?.filter((user) => {
    if (filterQuery.length === 0) return true;

    return user.email.includes(filterQuery) || user.name.includes(filterQuery);
  });

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
        {filteredUsers.length === 0 && (
          <p className="text-center font-bold">Sin resultados</p>
        )}
        {filteredUsers.map((user) => {
          return (
            <Card key={user.uid}>
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
                  <Switch
                    checked={user.roles.includes("ROLE_ADMIN")}
                    onCheckedChange={() => handleToggleAdmin(user)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
