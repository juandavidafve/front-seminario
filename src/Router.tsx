import { Icon } from "@iconify/react";
import {
  Route,
  Navigate,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router";

import { useAppSelector } from "@/hooks/redux";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/auth/Login";
import DatosPersonales from "@/pages/datos-personales";
import Horarios from "@/pages/horarios";
import Pensum from "@/pages/pensum";
import Usuarios from "@/pages/usuarios";

import Layout from "./Layout";
import "./index.css";

export default function Router() {
  const user = useAppSelector((state) => state.auth.user);

  if (user === undefined)
    return (
      <div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center">
        <Icon
          icon="svg-spinners:blocks-shuffle-3"
          className="size-12 text-primary"
        />
      </div>
    );

  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route
          element={user !== null ? <Layout /> : <Navigate to="/auth/login" />}
        >
          <Route index element={<Welcome />} />
          <Route path="datos-personales" element={<DatosPersonales />} />
          <Route path="pensum" element={<Pensum />} />
          {user?.roles.includes("ROLE_ADMIN") && (
            <Route path="usuarios" element={<Usuarios />} />
          )}
          <Route path="horarios" element={<Horarios />} />
        </Route>

        <Route
          path="/auth/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
      </>,
    ),
  );

  return <RouterProvider router={router} />;
}
