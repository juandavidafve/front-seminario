import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import {
  clearWorkflow,
  setChangelog,
  setPensum,
  setWorkflow,
} from "@/redux/slices/pensumSlice";
import { getChangelog, getPensum } from "@/services/pensum";
import {
  createWorkflow,
  getWorkflowByUUID,
  stopWorkflow,
} from "@/services/workflow";
import type { Job, Workflow } from "@/types/Workflow";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function WorkflowView({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector((state) => state.pensum.workflow);

  useEffect(() => {
    let interval = null;

    if (workflow?.state === "PROCESSING") {
      interval = setInterval(async () => {
        const res = await getWorkflowByUUID(workflow.uuid);
        if (res.state === "SUCCESS") {
          toast.success(
            "La sincronización con Divisist se completó correctamente.",
          );

          const pensum = await getPensum();
          dispatch(setPensum(pensum));

          const changelogData = await getChangelog();
          dispatch(setChangelog(changelogData));
        }
        if (res.state === "ERROR") {
          toast.error(
            "Ocurrió un error durante la sincronización con Divisist. Intenta nuevamente.",
          );
        }
        dispatch(setWorkflow(structuredClone(res)));
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      interval = null;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [workflow, dispatch]);

  function parseState(state: Workflow["state"] | Job["state"]) {
    switch (state) {
      case "PROCESSING":
        return "Procesando";
      case "SUCCESS":
        return "Finalizado";
      case "ERROR":
        return "Error";
      case "PENDING":
        return "Pendiente";
      case "STOPPED":
        return "Detenido";
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open && workflow?.state === "SUCCESS") {
      dispatch(clearWorkflow());
    }

    onOpenChange(open);
  }

  async function handleRetry() {
    const data = await createWorkflow();
    dispatch(setWorkflow(data));
  }

  async function handleStop() {
    if (workflow?.state === "PROCESSING") {
      await stopWorkflow(workflow!.uuid);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Workflow {workflow?.uuid.split("-")[0]} -{" "}
            <span
              className={cn(
                workflow?.state === "PROCESSING" && "text-yellow-500",
                workflow?.state === "SUCCESS" && "text-green-500",
                workflow?.state === "ERROR" && "text-red-500",
              )}
            >
              {workflow?.state && parseState(workflow.state)}
            </span>
          </DialogTitle>
          <DialogDescription>
            {workflow?.start && (
              <span>Inicio: {new Date(workflow.start).toLocaleString()}</span>
            )}

            {workflow?.end && (
              <span> | Fin: {new Date(workflow.end).toLocaleString()}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Barra de progreso */}
        <div className="my-4">
          <Progress value={workflow?.progress} />
          <p className="mt-1 text-sm text-gray-600">
            {workflow?.progress.toFixed(0)}% completado
          </p>
        </div>

        {/* Lista de jobs */}
        <div className="h-48 space-y-2 overflow-y-auto">
          {workflow?.jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center space-x-2">
                {job.state === "SUCCESS" && (
                  <Icon
                    icon="material-symbols:check-circle-outline-rounded"
                    className="size-6 text-green-500"
                  ></Icon>
                )}
                {job.state === "PENDING" && (
                  <Icon
                    icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
                    className="size-6 text-yellow-500"
                  ></Icon>
                )}
                {job.state === "ERROR" && (
                  <Icon
                    icon="material-symbols:error-outline-rounded"
                    className="size-6 text-red-500"
                  ></Icon>
                )}
                <div>
                  <p className="font-medium">{job.description}</p>
                  <p className="text-xs text-gray-500">{job.type}</p>
                </div>
              </div>
              <p
                className={cn(
                  "font-medium",
                  job.state === "SUCCESS" && "text-green-500",
                  job.state === "PENDING" && "text-yellow-500",
                  job.state === "ERROR" && "text-red-500",
                )}
              >
                {parseState(job.state)}
              </p>
            </div>
          ))}

          {workflow?.jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Icon
                icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
                className="mb-4 size-12 animate-pulse"
              />
              <p className="text-lg font-medium">Esperando trabajos</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          {(workflow?.state === "ERROR" || workflow?.state === "STOPPED") && (
            <Button onClick={handleRetry}>Reintentar</Button>
          )}
          <Button
            onClick={handleStop}
            disabled={workflow?.state !== "PROCESSING"}
          >
            Detener
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
