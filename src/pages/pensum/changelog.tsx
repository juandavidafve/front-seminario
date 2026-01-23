import { Icon } from "@iconify/react";
import { History, Info } from "lucide-react";
import { useEffect } from "react";

import { Accordion } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setChangelog } from "@/redux/slices/pensumSlice";
import { getChangelog } from "@/services/pensum";

import PensumSingleChangelog from "./components/changelog/PensumSingleChangelog";

interface ChangelogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeLog({ open, onOpenChange }: ChangelogProps) {
  const dispatch = useAppDispatch();
  const changelogs = useAppSelector((state) => state.pensum.changelog);

  useEffect(() => {
    (async () => {
      const data = await getChangelog();
      console.log(data);
      dispatch(setChangelog(data));
    })();
  }, [dispatch]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-screen overflow-y-auto sm:max-w-2xl [&>button:first-of-type]:hidden"
      >
        <SheetHeader>
          <div className="flex items-center justify-between gap-5">
            <SheetTitle className="flex items-center gap-3 text-xl">
              <History className="h-6 w-6 text-primary" />
              Registro de Cambios
            </SheetTitle>
            <SheetClose asChild={true}>
              <Button size="icon" variant="ghost">
                <Icon icon="material-symbols:close-rounded" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mx-4 space-y-4 px-1">
          {changelogs?.length === 0 ? (
            <AlertDialog>
              <Info className="h-4 w-4" />
              <AlertDialogDescription>
                No se han registrado cambios en la información del Pensum
              </AlertDialogDescription>
            </AlertDialog>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Historial de actualizaciones del pensum
              </p>
              <Accordion type="single" collapsible className="space-y-2">
                {changelogs!.map((changelog) => (
                  <PensumSingleChangelog
                    key={changelog.id}
                    changelog={changelog}
                  />
                ))}
              </Accordion>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
