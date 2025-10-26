import { Panel } from "@xyflow/react";
import type { ReactFlowProps } from "@xyflow/react";

import { NodeSearch } from "@/components/node-search";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { SubjectSchema } from "@/schemas/Pensum";

interface Props {
  nodes: ReactFlowProps["nodes"];
  onSave: () => void;
  onAdd: () => void;
}

export function PensumToolbar({ nodes, onSave, onAdd }: Props) {
  const roles = useAppSelector((s) => s.auth.user?.roles);
  const hasChanged = useAppSelector((s) => s.pensum.hasChanged);

  return (
    <>
      <Panel
        className="flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
        position="top-left"
      >
        <NodeSearch
          onSearch={(query) => {
            const lQuery = query.toLowerCase();
            if (!nodes) return [];
            return nodes.filter((n) => {
              const { data: subject } = SubjectSchema.safeParse(n.data.subject);
              return (
                subject &&
                (subject.code.toLowerCase().includes(lQuery) ||
                  subject.name.toLowerCase().includes(lQuery))
              );
            });
          }}
        />
      </Panel>

      {roles?.includes("ROLE_ADMIN") && (
        <Panel position="top-right" className="flex gap-2">
          <Button onClick={onSave} disabled={!hasChanged}>
            Guardar
          </Button>
          <Button onClick={onAdd}>Agregar</Button>
        </Panel>
      )}
    </>
  );
}
