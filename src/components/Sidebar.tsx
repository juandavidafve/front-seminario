import { Icon } from "@iconify/react";
import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: string;
  url: string;
  show?: boolean;
}

export default function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const { pathname } = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Usuarios",
      icon: "material-symbols:supervised-user-circle-outline",
      url: "/usuarios",
      show: user?.roles.includes("ROLE_ADMIN"),
    },
    {
      label: "Pensum",
      icon: "material-symbols:school-outline-rounded",
      url: "/pensum",
    },
    {
      label: "Datos Personales",
      icon: "material-symbols:id-card-outline-rounded",
      url: "/datos-personales",
    },
  ];

  const currentNavItem = navItems.find((item) => item.url === pathname);

  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      {!collapsed && (
        <div
          className="fixed top-0 left-0 z-10 h-screen w-screen bg-neutral-950 opacity-30"
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-10 grid w-full grid-rows-[auto_1fr_auto] space-y-10 overflow-hidden bg-sidebar p-3 text-sidebar-foreground transition-[height] lg:min-h-screen lg:transition-[width]",
          collapsed && "h-16 lg:w-16",
          !collapsed && "h-screen lg:w-64",
        )}
      >
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon icon="mdi:menu" className="size-6" />
          </Button>

          <UserTrigger>
            <Icon icon="mingcute:user-4-fill" className="size-6 lg:hidden" />
          </UserTrigger>
        </div>
        <nav className="flex flex-col items-start gap-4 overflow-y-auto">
          {navItems.map(
            (item, index) =>
              item.show !== false && (
                <Link to={item.url} key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start has-[>svg]:p-0",
                      currentNavItem === item &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                      collapsed && "w-9",
                    )}
                    onClick={() => {
                      setCollapsed(true);
                    }}
                  >
                    <Icon icon={item.icon} className="ml-[6px] size-6" />
                    <span
                      className={cn(
                        "mr-[6px] overflow-hidden transition-opacity",
                        collapsed && "opacity-0",
                      )}
                    >
                      {item.label}
                    </span>
                  </Button>
                </Link>
              ),
          )}
        </nav>
        <UserTrigger>
          <div
            className={cn(
              "hidden h-9 grid-cols-[auto_1fr] items-center lg:grid",
            )}
          >
            <Icon
              icon="mingcute:user-4-fill"
              className="mr-3 ml-[calc(var(--spacing)*1.8)] size-6"
            />

            <p
              className={cn(
                "overflow-hidden font-bold overflow-ellipsis whitespace-nowrap transition",
                collapsed && "w-0 opacity-0",
              )}
            >
              {user?.name}
            </p>
          </div>
        </UserTrigger>
      </aside>
    </>
  );
}

function UserTrigger({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);

  const navigate = useNavigate();

  async function handleLogout() {
    await auth.signOut();
    navigate("/");
  }

  return (
    <Popover>
      <PopoverTrigger className={"cursor-pointer"}>{children}</PopoverTrigger>
      <PopoverContent className="flex w-fit flex-col items-center">
        <p className="text-center font-bold">{user?.name}</p>
        <p className="text-center">
          {user?.roles.includes("ROLE_ADMIN") ? "Administrador" : "Usuario"}
        </p>

        <Separator className="my-2" />

        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
