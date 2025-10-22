import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import { GroupNode } from "@/components/labeled-group-node";
import { NodeSearch } from "@/components/node-search";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { SubjectSchema, type Pensum } from "@/schemas/Pensum";

import SubjectNode from "./SubjectNode";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  subjectNode: SubjectNode,
};

export default function PensumGraph() {
  const pensum = useAppSelector((state) => state.pensum.data);
  const [nodes, setNodes] = useState<ReactFlowProps["nodes"]>();
  const [edges, setEdges] = useState<ReactFlowProps["edges"]>();

  useEffect(() => {
    if (!pensum) return;
    const parsed = parsePensum(pensum);

    console.log(parsed);

    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  }, [pensum]);

  function parsePensum(pensum: Pensum) {
    const semesterCounter: number[] = [];

    const nodes: ReactFlowProps["nodes"] = pensum.subjects.map((subject) => {
      const { semester } = subject;

      if (!semesterCounter[semester]) {
        semesterCounter[semester] = 1;
      } else {
        semesterCounter[semester]++;
      }

      return {
        id: subject.code,
        position: {
          x: 75,
          y: semesterCounter[semester] * 100,
        },
        data: subject,
        parentId: `semester-${semester}`,
        extent: "parent",
        type: "subjectNode",
      };
    });

    const edges: ReactFlowProps["edges"] = pensum.subjects.flatMap(
      (subject) => {
        if (subject.requisites.length === 0) return [];

        const edges: ReactFlowProps["edges"] = [];

        for (const requisite of subject.requisites) {
          edges.push({
            id: `${requisite.code}-${subject.code}`,
            source: requisite.code,
            target: subject.code,
          });
        }

        return edges;
      },
    );

    // Max quantity of subjects in one semester
    const maxSubjects = Math.max(
      ...semesterCounter.filter((element) => element),
    );

    const semesterNodes: ReactFlowProps["nodes"] = semesterCounter
      .map((_val, index) => {
        return {
          id: `semester-${index}`,
          position: { x: index * 300, y: 0 },
          data: { label: `Semestre ${index}` },
          width: 300,
          height: maxSubjects * 100 + 100,
          type: "labeledGroupNode",
        };
      })
      .filter((element) => element);

    return {
      edges,
      nodes: [...semesterNodes, ...nodes],
    };
  }

  const onNodesChange = useCallback((changes) => {
    console.log("onNodesChange");
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);
  const onEdgesChange = useCallback((changes) => {
    console.log("onEdgesChange");
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);
  const onConnect = useCallback((params) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    console.log("onConnect");
  }, []);

  return (
    <div className="h-96 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        <Panel
          className="flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
          position="top-left"
        >
          <NodeSearch
            onSearch={(query) => {
              const lQuery = query.toLowerCase();
              if (!nodes) return [];

              const filteredNodes = nodes.filter((node) => {
                const { data: subject } = SubjectSchema.safeParse(node.data);

                if (!subject) return false;

                return (
                  subject.code.toLowerCase().includes(lQuery) ||
                  subject.name.toLowerCase().includes(lQuery)
                );
              });

              return filteredNodes.map((node) => {
                const { data: subject } = SubjectSchema.safeParse(node.data);

                if (!subject) return node;

                return {
                  ...node,
                  data: {
                    label: `${subject.code} - ${subject.name}`,
                    ...node.data,
                  },
                };
              });
            }}
          />
        </Panel>

        <Panel position="top-right">
          <Button>Agregar</Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
