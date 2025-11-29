import type { ReactFlowProps } from "@xyflow/react";

import type { Pensum, Subject } from "@/types/Pensum";

import type { ViewType } from "../components/graph/PensumGraph";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const SPACING = 25;

export interface SubjectNodeOptions {
  onView: (s: Subject) => void;
  onEdit: (s: Subject) => void;
  onDelete: (s: Subject) => void;
  viewMode: ViewType;
}

export default function parse(pensum: Pensum, options: SubjectNodeOptions) {
  const semesterCounter: number[] = Array(pensum.semesters + 1).fill(0);

  const nodes: ReactFlowProps["nodes"] = pensum.subjects.map((subject) => {
    const { semester } = subject;

    const node: NonNullable<ReactFlowProps["nodes"]>[number] = {
      id: subject.code,
      position: {
        x: SPACING,
        y: SPACING * 3 + semesterCounter[semester] * (NODE_HEIGHT + SPACING),
      },
      data: {
        subject,
        ...options,
      },
      parentId: `semester-${semester}`,
      extent: "parent",
      type: "subjectNode",
    };

    semesterCounter[semester]++;

    return node;
  });

  const edges: ReactFlowProps["edges"] = pensum.subjects.flatMap((subject) => {
    if (subject.requisites.length === 0) return [];

    const edges: ReactFlowProps["edges"] = [];

    for (const requisite of subject.requisites) {
      const colors = [
        "[--xy-edge-stroke:theme(colors.red.500)]",
        "[--xy-edge-stroke:theme(colors.orange.500)]",
        "[--xy-edge-stroke:theme(colors.amber.500)]",
        "[--xy-edge-stroke:theme(colors.yellow.500)]",
        "[--xy-edge-stroke:theme(colors.lime.500)]",
        "[--xy-edge-stroke:theme(colors.green.500)]",
        "[--xy-edge-stroke:theme(colors.emerald.500)]",
        "[--xy-edge-stroke:theme(colors.teal.500)]",
        "[--xy-edge-stroke:theme(colors.cyan.500)]",
        "[--xy-edge-stroke:theme(colors.sky.500)]",
        "[--xy-edge-stroke:theme(colors.blue.500)]",
        "[--xy-edge-stroke:theme(colors.indigo.500)]",
        "[--xy-edge-stroke:theme(colors.violet.500)]",
        "[--xy-edge-stroke:theme(colors.purple.500)]",
        "[--xy-edge-stroke:theme(colors.fuchsia.500)]",
        "[--xy-edge-stroke:theme(colors.pink.500)]",
        "[--xy-edge-stroke:theme(colors.rose.500)]",
      ];

      edges.push({
        id: `${requisite.code}-${subject.code}`,
        source: requisite.code,
        target: subject.code,
        className: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return edges;
  });

  const semesterNodes: ReactFlowProps["nodes"] = semesterCounter
    .map((val, index) => {
      if (val === 0) return null;

      const width = NODE_WIDTH + SPACING * 2;
      return {
        id: `semester-${index}`,
        position: { x: (width + SPACING) * index, y: 0 },
        data: { label: `Semestre ${index}` },
        width: width,
        height: SPACING * 3 + val * (NODE_HEIGHT + SPACING),
        type: "labeledGroupNode",
      };
    })
    .filter((e) => e !== null);

  return {
    edges,
    nodes: [...semesterNodes, ...nodes],
  };
}
