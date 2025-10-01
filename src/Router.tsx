import { HashRouter, Routes, Route } from "react-router";

import Sidebar from "./components/Sidebar";
import "./index.css";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Sidebar />} />
      </Routes>
    </HashRouter>
  );
}
