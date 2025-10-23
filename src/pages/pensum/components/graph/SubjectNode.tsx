import { Icon } from "@iconify/react";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Subject } from "@/schemas/Pensum";

interface Props extends Record<string, unknown> {
  onView: (s: Subject) => void;
  onEdit: (s: Subject) => void;
  onDelete: (s: Subject) => void;
  subject: Subject;
}

export default function SubjectNode({ data }: NodeProps<Node<Props>>) {
  const { subject, onDelete, onEdit } = data;

  const isElective = subject.type.includes("ELECTIVE");

  return (
    <>
      <NodeToolbar
        position={Position.Top}
        align="center"
        className="flex gap-1"
      >
        <Button size="icon" onClick={() => onEdit(subject)}>
          <Icon icon="material-symbols:edit-outline-rounded"></Icon>
        </Button>
        <Button size="icon" onClick={() => onDelete(subject)}>
          <Icon icon="material-symbols:delete-outline-rounded"></Icon>
        </Button>
      </NodeToolbar>
      <BaseNode
        className={cn("h-[100px] w-[200px]", isElective ? "bg-secondary" : "")}
      >
        <BaseNodeContent className="flex h-full flex-col items-center justify-center">
          <span className="line-clamp-2 text-center font-bold">
            {subject.name}
          </span>
          <span className="text-sm">
            {subject.code}
            {isElective && " - Electiva"}
          </span>

          <Handle
            type="source"
            position={Position.Right}
            isConnectable={false}
          />
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={false}
          />
        </BaseNodeContent>
      </BaseNode>
    </>
  );
}
