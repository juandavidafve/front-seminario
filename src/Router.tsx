import { HashRouter, Routes, Route, Navigate } from "react-router";

import { useAppSelector } from "@/hooks/redux";
import Login from "@/pages/auth/Login";
import DatosPersonales from "@/pages/datos-personales";
import Usuarios from "@/pages/usuarios";

import Layout from "./Layout";
import "./index.css";

export default function Router() {
  const user = useAppSelector((state) => state.auth.user);

  if (user === undefined) return "Loading";

  return (
    <HashRouter>
      <Routes>
        <Route
          element={user !== null ? <Layout /> : <Navigate to="/auth/login" />}
        >
          <Route index />
          <Route path="datos-personales" element={<DatosPersonales />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        <Route
          path="/auth/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </HashRouter>
  );
}
