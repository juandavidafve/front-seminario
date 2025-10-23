import type { ReactFlowProps } from "@xyflow/react";

import type { Pensum, Subject } from "@/schemas/Pensum";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const SPACING = 25;

interface Actions {
  onView?: (s: Subject) => void;
  onEdit?: (s: Subject) => void;
  onDelete?: (s: Subject) => void;
}

export default function parse(pensum: Pensum, actions: Actions) {
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
        ...actions,
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
      edges.push({
        id: `${requisite.code}-${subject.code}`,
        source: requisite.code,
        target: subject.code,
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
