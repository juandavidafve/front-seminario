import { Icon } from "@iconify/react";
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
          onSearch={(query): NonNullable<ReactFlowProps["nodes"]> => {
            const lQuery = query.toLowerCase();
            if (!nodes) return [];

            const results: NonNullable<ReactFlowProps["nodes"]> = [];

            for (const n of nodes) {
              const parsed = SubjectSchema.safeParse(n.data.subject);
              if (!parsed.success) continue;
              const subject = parsed.data;

              if (
                subject.code.toLowerCase().includes(lQuery) ||
                subject.name.toLowerCase().includes(lQuery)
              ) {
                results.push({
                  ...n,
                  data: {
                    subject,
                    label: `${subject.code} - ${subject.name}`,
                  },
                });
              }
            }

            return results;
          }}
        />
      </Panel>

      {roles?.includes("ROLE_ADMIN") && (
        <Panel position="bottom-right" className="!m-6 flex flex-col gap-2">
          {hasChanged && (
            <Button onClick={onSave} className="size-11" variant="outline">
              <Icon icon="material-symbols:save-outline" className="size-6" />
            </Button>
          )}
          <Button onClick={onAdd} className="size-11">
            <Icon icon="material-symbols:add-2-rounded" className="size-6" />
          </Button>
        </Panel>
      )}
    </>
  );
}
