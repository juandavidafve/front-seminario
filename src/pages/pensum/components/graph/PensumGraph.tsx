import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { GroupNode } from "@/components/labeled-group-node";
import { NodeSearch } from "@/components/node-search";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  insertSubject,
  removeSubject,
  setPensum,
  updateSubject,
} from "@/redux/slices/pensumSlice";
import { SubjectSchema, type Subject } from "@/schemas/Pensum";
import { savePensum } from "@/services/pensum";

import { SubjectForm } from "../forms/SubjectForm";
import parse from "./GraphParser";
import SubjectNode from "./SubjectNode";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  subjectNode: SubjectNode,
};

export default function PensumGraph() {
  const dispatch = useAppDispatch();
  const pensumChanged = useAppSelector((state) => state.pensum.hasChanged);
  const pensum = useAppSelector((state) => state.pensum.data);
  const [nodes, setNodes] = useState<ReactFlowProps["nodes"]>();
  const [edges, setEdges] = useState<ReactFlowProps["edges"]>();
  const [showForm, setShowForm] = useState(false);
  const [formDefaults, setFormDefaults] = useState<Subject | undefined>(
    undefined,
  );
  const [formAction, setFormAction] = useState<(s: Subject) => void>(
    () => () => {},
  );

  async function callSavePensum() {
    const data = await savePensum(pensum!);
    dispatch(setPensum(data));
    toast.success("Pensum actualizado correctamente");
  }

  useEffect(() => {
    if (!pensum) return;
    const parsed = parse(pensum, {
      onEdit: openEditForm,
      onDelete: handleDelete,
    });

    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  }, [pensum]);

  function openCreateForm() {
    setFormDefaults(undefined);
    setShowForm(true);
    setFormAction(() => (s: Subject) => {
      dispatch(insertSubject(s));
    });
  }

  function openEditForm(subject: Subject) {
    const { code } = subject;
    setFormDefaults(subject);
    setShowForm(true);
    setFormAction(() => (subject: Subject) => {
      dispatch(updateSubject({ subject, code }));
    });
  }

  function handleDelete(subject: Subject) {
    dispatch(removeSubject(subject.code));
  }

  const onNodesChange = useCallback((changes) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);
  const onEdgesChange = useCallback((changes) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  return (
    <>
      <SubjectForm
        onSubmit={formAction}
        onOpenChange={setShowForm}
        open={showForm}
        defaultValues={formDefaults}
      />
      <div className="mb-4 h-[calc(100vh-var(--spacing)*44)] lg:h-[calc(100vh-var(--spacing)*28)]">
        <div className="absolute right-6 h-[calc(100vh-var(--spacing)*44)] w-[calc(100vw-var(--spacing)*12)] rounded-md border lg:h-[calc(100vh-var(--spacing)*28)] lg:w-[calc(100vw-var(--spacing)*28)]">
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
            <Panel
              className="flex gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
              position="top-left"
            >
              <NodeSearch
                onSearch={(query) => {
                  const lQuery = query.toLowerCase();

                  if (!nodes) return [];

                  const filteredNodes = nodes.filter((node) => {
                    const { data: subject } = SubjectSchema.safeParse(
                      node.data.subject,
                    );

                    if (!subject) return false;

                    return (
                      subject.code.toLowerCase().includes(lQuery) ||
                      subject.name.toLowerCase().includes(lQuery)
                    );
                  });

                  return filteredNodes.map((node) => {
                    const { data: subject } = SubjectSchema.safeParse(
                      node.data.subject,
                    );

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

            <Panel position="top-right" className="flex gap-2">
              <Button onClick={callSavePensum} disabled={!pensumChanged}>
                Guardar
              </Button>
              <Button onClick={openCreateForm}>Agregar</Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
