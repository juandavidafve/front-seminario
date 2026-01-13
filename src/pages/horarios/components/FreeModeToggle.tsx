import { CircleQuestionMarkIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Schedule } from "@/types/Schedule";

interface Props {
  schedule: Schedule;
  onToggle(): void;
}

export default function FreeModeToggle({ schedule, onToggle }: Props) {
  const [value, setValue] = useState(false);

  useEffect(() => setValue(schedule.freeMode), [schedule.freeMode]);

  return (
    <div className="flex items-start gap-4">
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Label htmlFor="title">Modo Libre</Label>
          <HoverCard>
            <HoverCardTrigger>
              <CircleQuestionMarkIcon />
            </HoverCardTrigger>
            <HoverCardContent>
              <div>
                <p className="text-justify">
                  En el modo libre podrás matricular cualquier materia,
                  independientemente de si ya la has visto o no. Esto te
                  permitirá explorar opciones para horarios futuros o para otras
                  personas.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex items-center space-x-3">
          <Switch checked={value} onCheckedChange={onToggle} />
          <h1 className="text-md">{value ? "Activado" : "Desactivado"}</h1>
        </div>
      </div>
    </div>
  );
}
