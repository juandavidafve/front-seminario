import { HashRouter, Routes, Route, Navigate } from "react-router";

import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/hooks/redux";
import Login from "@/pages/auth/Login";

import "./index.css";

export default function Router() {
  const user = useAppSelector((state) => state.auth.user);

  if (user === undefined) return "Loading";

  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={user !== null ? <Sidebar /> : <Navigate to="/auth/login" />}
        />

        <Route
          path="/auth/login"
          element={user === null ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </HashRouter>
  );
}
