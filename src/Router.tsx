import { HashRouter, Routes, Route, Navigate } from "react-router";

import { useAppSelector } from "@/hooks/redux";
import Login from "@/pages/auth/Login";

import Layout from "./Layout";
import "./index.css";
import DatosPersonales from "./pages/datos-personales";

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
        </Route>

        <Route
          path="/auth/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </HashRouter>
  );
}
