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

export default function SubjectNode({ data }: NodeProps<Node<Subject>>) {
  const isElective = data.type.includes("ELECTIVE");

  return (
    <>
      <NodeToolbar position={Position.Top} className="flex gap-2">
        <Button size="icon">
          <Icon icon="ic:outline-remove-red-eye" />
        </Button>
        <Button size="icon">
          <Icon icon="material-symbols:edit-outline-rounded" />
        </Button>
      </NodeToolbar>

      <BaseNode
        className={cn("h-[100px] w-[200px]", isElective ? "bg-secondary" : "")}
      >
        <BaseNodeContent className="flex h-full flex-col items-center justify-center">
          <span className="line-clamp-2 text-center font-bold">
            {data.name}
          </span>
          <span className="text-sm">
            {data.code}
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
