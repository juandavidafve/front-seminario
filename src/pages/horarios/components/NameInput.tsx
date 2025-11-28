import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Schedule } from "@/types/Schedule";

interface Props {
  schedule: Schedule;
  onChange(title: string): void;
}

export default function NameInput({ schedule, onChange }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => setValue(schedule.title), [schedule.title]);

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre</Label>
        <Input
          id="title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {value !== schedule.title && (
        <Button size="icon" variant="secondary" onClick={() => onChange(value)}>
          <Icon icon="material-symbols:save-outline" className="size-6" />
        </Button>
      )}
    </div>
  );
}
