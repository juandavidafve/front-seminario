import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAppSelector } from "@/hooks/redux";
import type { Group } from "@/types/Pensum";
import type { ScheduleGroup } from "@/types/Schedule";

interface Props {
  group: ScheduleGroup;
  onSelect(group: Group): void;
}

export default function GroupSelect({ group, onSelect }: Props) {
  const subject = useAppSelector((state) => {
    return state.pensum.data?.subjects.find(
      (s) => s.code === group.subjectCode,
    );
  });

  function handleSelect(code: string) {
    const g = subject?.groups.find((g) => g.code === code);
    if (!g) return;

    onSelect(g);
  }

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="!h-auto w-full">
        <div className="text-left">
          <p className="font-bold text-foreground">
            {group.name} - {group.credits} Créditos
          </p>
          <p className="text-muted-foreground">
            Grupo {group.code.slice(-1)} - {group.teacher}
          </p>
        </div>
      </SelectTrigger>
      <SelectContent>
        {subject?.groups.map((g) => (
          <SelectItem value={g.code} key={g.code}>
            {g.code} - {g.teacher}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
