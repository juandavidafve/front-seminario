import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmLeaveDialog({ open, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Salir sin guardar?</AlertDialogTitle>
          <AlertDialogDescription>
            Tienes cambios sin guardar. Si sales, se perderán los datos no
            guardados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Salir</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
