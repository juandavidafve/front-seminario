import { Icon } from "@iconify/react";
import { HashRouter, Routes, Route, Navigate } from "react-router";

import { useAppSelector } from "@/hooks/redux";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/auth/Login";
import DatosPersonales from "@/pages/datos-personales";
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

  return (
    <HashRouter>
      <Routes>
        <Route
          element={user !== null ? <Layout /> : <Navigate to="/auth/login" />}
        >
          <Route index element={<Welcome />} />
          <Route path="datos-personales" element={<DatosPersonales />} />

          {user?.roles.includes("ROLE_ADMIN") && (
            <Route path="usuarios" element={<Usuarios />} />
          )}
        </Route>

        <Route
          path="/auth/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </HashRouter>
  );
}
