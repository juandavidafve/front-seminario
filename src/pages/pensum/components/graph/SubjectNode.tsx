import { Icon } from "@iconify/react";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useRef } from "react";

import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
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
  const user = useAppSelector((state) => state.auth.user);

  const isElective = subject.type.includes("ELECTIVE");

  const colors = [
    "bg-red-50",
    "bg-orange-50",
    "bg-amber-50",
    "bg-yellow-50",
    "bg-lime-50",
    "bg-green-50",
    "bg-emerald-50",
    "bg-teal-50",
    "bg-cyan-50",
    "bg-sky-50",
    "bg-blue-50",
    "bg-indigo-50",
    "bg-violet-50",
    "bg-purple-50",
    "bg-fuchsia-50",
    "bg-pink-50",
    "bg-rose-50",
  ];

  const color = useRef(colors[Math.floor(Math.random() * colors.length)]);

  return (
    <>
      {user?.roles.includes("ROLE_ADMIN") && (
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
      )}
      <BaseNode
        className={cn(
          "h-[100px] w-[200px] shadow",
          isElective ? "bg-secondary" : "",
          color.current,
        )}
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
