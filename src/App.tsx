import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Router from "./Router";

export default function App() {
  return <Router />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
