import { Plus, Trash2, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { GroupChangeLog } from "@/types/Changelog";

import { FieldChangeItem } from "./FieldChangeItem";

interface GroupChangelogItemProps {
  group: GroupChangeLog;
}

const typeConfig = {
  ADDED: {
    icon: Plus,
    label: "Nuevo",
    variant: "default" as const,
    color: "text-green-600",
  },
  MODIFIED: {
    icon: Edit,
    label: "Modificado",
    variant: "secondary" as const,
    color: "text-blue-600",
  },
  DELETED: {
    icon: Trash2,
    label: "Eliminado",
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export function GroupChangelogItem({ group }: GroupChangelogItemProps) {
  const fieldChanges = Object.entries(group.fieldChanges);
  const config = typeConfig[group.type];
  const Icon = config.icon;

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
        <span className="text-sm font-medium">{group.code}</span>
        <Badge variant={config.variant} className="ml-auto text-xs">
          {config.label}
        </Badge>
      </div>

      {fieldChanges.length > 0 && (
        <div className="ml-4 space-y-1.5">
          {fieldChanges.map(([fieldName, change]) => (
            <FieldChangeItem
              key={fieldName}
              fieldName={fieldName}
              change={change}
            />
          ))}
        </div>
      )}
    </div>
  );
}
