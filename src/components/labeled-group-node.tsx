import { Panel, type NodeProps, type PanelPosition } from "@xyflow/react";
import { forwardRef, type HTMLAttributes } from "react";

import { BaseNode } from "@/components/base-node";
import { cn } from "@/lib/utils";

/* GROUP NODE Label ------------------------------------------------------- */

export type GroupNodeLabelProps = HTMLAttributes<HTMLDivElement>;

export const GroupNodeLabel = forwardRef<HTMLDivElement, GroupNodeLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className="h-full w-full" {...props}>
        <div
          className={cn(
            "w-fit bg-secondary p-2 text-xs text-card-foreground",
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

GroupNodeLabel.displayName = "GroupNodeLabel";

export type GroupNodeProps = Partial<NodeProps> & {
  data: {
    label: string;
  };
  position?: PanelPosition;
};

/* GROUP NODE -------------------------------------------------------------- */

export const GroupNode = forwardRef<HTMLDivElement, GroupNodeProps>(
  ({ data, position }, ref) => {
    const getLabelClassName = (position?: PanelPosition) => {
      switch (position) {
        case "top-left":
          return "rounded-br-sm";
        case "top-center":
          return "rounded-b-sm";
        case "top-right":
          return "rounded-bl-sm";
        case "bottom-left":
          return "rounded-tr-sm";
        case "bottom-right":
          return "rounded-tl-sm";
        case "bottom-center":
          return "rounded-t-sm";
        default:
          return "rounded-br-sm";
      }
    };

    return (
      <BaseNode
        ref={ref}
        className="bg-opacity-50 h-full overflow-hidden rounded-sm bg-white p-0"
      >
        <Panel className={cn("m-0 p-0")} position={position}>
          {data.label && (
            <GroupNodeLabel className={getLabelClassName(position)}>
              {data.label}
            </GroupNodeLabel>
          )}
        </Panel>
      </BaseNode>
    );
  },
);

GroupNode.displayName = "GroupNode";
