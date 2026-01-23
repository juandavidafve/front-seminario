import { Plus, Trash2, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SubjectChangeLog } from "@/types/Changelog";

import { FieldChangeItem } from "./FieldChangeItem";
import { GroupChangelogItem } from "./GroupChangelogItem";

interface SSCProps {
  changelog: SubjectChangeLog;
}

const typeConfig = {
  ADDED: {
    icon: Plus,
    label: "Agregado",
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

export function SubjectSingleChangelog({ changelog }: SSCProps) {
  const subjectFieldChanges = Object.entries(changelog.fieldChanges);
  const config = typeConfig[changelog.type];
  const Icon = config.icon;

  return (
    <div className="mb-4">
      <div className="pt-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <h3 className="font-semibold">
            {changelog.name}{" "}
            <span className="text-sm text-muted-foreground">
              ({changelog.code})
            </span>
          </h3>
          <Badge variant={config.variant} className="ml-auto">
            {config.label}
          </Badge>
        </div>

        {/* Cambios en campos de la materia */}
        {subjectFieldChanges.length > 0 && (
          <div className="mb-3 space-y-2">
            <p className="text-sm font-medium">Cambios en la materia:</p>
            <div className="ml-3 space-y-2">
              {subjectFieldChanges.map(([fieldName, change]) => (
                <FieldChangeItem
                  key={fieldName}
                  fieldName={fieldName}
                  change={change}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cambios en grupos */}
        {changelog.groupChangeLogs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Grupos afectados:</p>
            <div className="ml-3 space-y-3">
              {changelog.groupChangeLogs.map((group) => (
                <GroupChangelogItem key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
