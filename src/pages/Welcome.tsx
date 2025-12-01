import { Icon } from "@iconify/react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";

export default function Welcome() {
  const isAdmin = useAppSelector((state) =>
    state.auth.user?.roles.includes("ROLE_ADMIN"),
  );

  const items = [
    {
      icon: "material-symbols:calendar-clock-outline-rounded",
      title: "Horarios",
      description: "Horarios adaptados a tus necesitades.",
      actionUrl: "/horarios",
      actionName: "Crear",
    },
    {
      icon: "material-symbols:school-outline-rounded",
      title: "Pensum",
      description:
        "Consulta el plan de estudios y explora las materias disponibles.",
      actionUrl: "/pensum",
      actionName: "Ver",
    },
    {
      icon: "material-symbols:group-outline-rounded",
      title: "Usuarios",
      description: "Administra usuarios y controla sus permisos.",
      actionUrl: "/usuarios",
      actionName: "Gestionar",
      show: isAdmin,
    },
    {
      icon: "material-symbols:person-outline-rounded",
      title: "Datos Personales",
      description: "Modifica tu información personal, como nombre y correo.",
      actionUrl: "/datos-personales",
      actionName: "Actualizar",
    },
  ];

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">👋 ¡Bienvenido a HorarioApp!</h1>
      <p className="text-muted-foreground">
        Organiza tus horarios de manera fácil y rápida.
      </p>
      <h2 className="mt-8 mb-4 font-bold">Explora</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(
          (item) =>
            item.show !== false && (
              <Card
                className="gap-2 transition-shadow hover:shadow-lg"
                key={item.actionUrl}
              >
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon icon={item.icon} className="size-8 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <Link to={item.actionUrl}>
                    <Button className="w-full">{item.actionName}</Button>
                  </Link>
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </>
  );
}
