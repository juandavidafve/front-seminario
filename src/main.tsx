import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";
import store from "@/redux/store";

import Router from "./Router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-center" richColors />
      <Router />
    </Provider>
  </StrictMode>,
);
