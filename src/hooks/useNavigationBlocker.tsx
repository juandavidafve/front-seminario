// src/hooks/useNavigationBlocker.tsx
import { useEffect, useState } from "react";
import { useBlocker } from "react-router";

export function useNavigationBlocker(when: boolean) {
  const blocker = useBlocker(when);
  const [showDialog, setShowDialog] = useState(false);

  // Si la navegación fue bloqueada, muestra el diálogo personalizado
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowDialog(true);
    }
  }, [blocker]);

  // Manejo de recarga o cierre de pestaña
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [when]);

  // Funciones para controlar el diálogo
  const confirmNavigation = () => {
    setShowDialog(false);
    if (blocker.proceed) {
      blocker.proceed();
    }
  };

  const cancelNavigation = () => {
    setShowDialog(false);

    if (blocker.reset) {
      blocker.reset();
    }
  };

  return { showDialog, confirmNavigation, cancelNavigation };
}
