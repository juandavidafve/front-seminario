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
import type { Pensum, Subject } from "@/types/Pensum";

import parse from "../../utils/GraphParser";
import { PensumToolbar } from "./PensumToolbar";
import SubjectNode from "./SubjectNode";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  subjectNode: SubjectNode,
};

interface PensumGraphProps {
  pensum: Pensum | null;
  onView(subject: Subject): void;
  onEdit(subject: Subject): void;
  onDelete(subject: Subject): void;
  onAdd(): void;
  onSave(): void;
  onWorkflow(): void;
}

export function PensumGraph({
  pensum,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onWorkflow,
}: PensumGraphProps) {
  const [nodes, setNodes] = useState<ReactFlowProps["nodes"]>();
  const [edges, setEdges] = useState<ReactFlowProps["edges"]>();

  useEffect(() => {
    if (!pensum) return;
    const parsed = parse(pensum, {
      onView,
      onEdit,
      onDelete,
    });
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  }, [pensum, onView, onEdit, onDelete]);

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
      </ReactFlow>
    </div>
  );
}
