import { Icon } from "@iconify/react";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useMemo } from "react";

import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types/Pensum";

import type { SubjectNodeOptions } from "../../utils/GraphParser";

interface Props extends SubjectNodeOptions, Record<string, unknown> {
  subject: Subject;
}

const DEFAULT_COLORS = [
  "bg-red-100",
  "bg-orange-100",
  "bg-amber-100",
  "bg-yellow-100",
  "bg-lime-100",
  "bg-green-100",
  "bg-emerald-100",
  "bg-teal-100",
  "bg-cyan-100",
  "bg-sky-100",
  "bg-blue-100",
  "bg-indigo-100",
  "bg-violet-100",
  "bg-purple-100",
  "bg-fuchsia-100",
  "bg-pink-100",
  "bg-rose-100",
];

export default function SubjectNode({ data }: NodeProps<Node<Props>>) {
  const { subject, onDelete, onEdit, onView, viewMode } = data;
  const user = useAppSelector((state) => state.auth.user);
  const workflow = useAppSelector((state) => state.pensum.workflow);

  const isElective = subject.type.includes("ELECTIVE");

  const color = useMemo(() => {
    if (viewMode === "DEFAULT") {
      return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
    }

    if (viewMode === "ENROLL") {
      return subject.isCompleted
        ? "bg-green-100"
        : subject.canEnroll
          ? "bg-yellow-100"
          : "bg-red-100";
    }

    if (viewMode === "CRITICAL_ROUTE") {
      return subject.isCritical ? "bg-blue-100" : "bg-neutral-100";
    }

    return "bg-red-500";
  }, [subject.canEnroll, subject.isCompleted, subject.isCritical, viewMode]);

  const uiDisabled = workflow?.state === "PROCESSING";

  return (
    <>
      <NodeToolbar
        position={Position.Top}
        align="center"
        className="flex gap-1"
      >
        <Button size="icon" onClick={() => onView(subject)}>
          <Icon icon="mdi:eye-outline"></Icon>
        </Button>
        {user?.roles.includes("ROLE_ADMIN") && (
          <>
            <Button
              size="icon"
              onClick={() => onEdit(subject)}
              disabled={uiDisabled}
            >
              <Icon icon="material-symbols:edit-outline-rounded"></Icon>
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete(subject)}
              disabled={uiDisabled}
            >
              <Icon icon="material-symbols:delete-outline-rounded"></Icon>
            </Button>
          </>
        )}
      </NodeToolbar>

      <BaseNode
        className={cn(
          "h-[100px] w-[200px] shadow",
          isElective ? "bg-secondary" : "",
          color,
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
