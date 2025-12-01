// PensumGraph.tsx
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type EdgeChange,
  type NodeChange,
  type ReactFlowProps,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import { GroupNode } from "@/components/labeled-group-node";
import { useAppSelector } from "@/hooks/redux";
import type { Subject } from "@/types/Pensum";

import parse from "../../utils/GraphParser";
import { PensumToolbar } from "./PensumToolbar";
import SettingsPanel from "./SettingsPanel";
import SubjectNode from "./SubjectNode";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  subjectNode: SubjectNode,
};

interface PensumGraphProps {
  onView(subject: Subject): void;
  onEdit(subject: Subject): void;
  onDelete(subject: Subject): void;
  onAdd(): void;
  onSave(): void;
  onWorkflow(): void;
}

export type ViewType = "DEFAULT" | "ENROLL" | "CRITICAL_ROUTE";

export function PensumGraph({
  onView,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onWorkflow,
}: PensumGraphProps) {
  const pensum = useAppSelector((state) => state.pensum.data);
  const [nodes, setNodes] = useState<ReactFlowProps["nodes"]>();
  const [edges, setEdges] = useState<ReactFlowProps["edges"]>();
  const [viewMode, setViewMode] = useState<ViewType>("DEFAULT");

  useEffect(() => {
    if (!pensum) return;
    const parsed = parse(pensum, {
      onView,
      onEdit,
      onDelete,
      viewMode,
    });

    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  }, [onDelete, onEdit, onView, pensum, viewMode]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => nds && applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => eds && applyEdgeChanges(changes, eds));
  }, []);

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <PensumToolbar
          nodes={nodes}
          onAdd={onAdd}
          onSave={onSave}
          onWorkflow={onWorkflow}
        />
        <SettingsPanel value={viewMode} onValueChange={setViewMode} />
      </ReactFlow>
    </div>
  );
}
