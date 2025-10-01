import { HashRouter, Routes, Route } from "react-router";

import Sidebar from "./components/Sidebar";
import Login from "./components/pages/auth/Login";
import "./index.css";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Sidebar />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}
