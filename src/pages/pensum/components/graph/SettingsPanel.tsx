import { Icon } from "@iconify/react";
import { Panel } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { ViewType } from "./PensumGraph";

interface Props {
  value: ViewType;
  onValueChange(value: ViewType): void;
}

export default function SettingsPanel({ value, onValueChange }: Props) {
  return (
    <Panel position="top-right">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon">
            <Icon
              icon="material-symbols:settings-outline-rounded"
              className="size-6"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <RadioGroup value={value} onValueChange={onValueChange}>
            <p className="font-bold">Modo de Visualización</p>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DEFAULT" id="default-view" />
              <Label htmlFor="default-view">Por defecto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ENROLL" id="enroll-view" />
              <Label htmlFor="enroll-view">Matricula</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CRITICAL_ROUTE" id="critical-route-view" />
              <Label htmlFor="critical-route-view">Ruta Crítica</Label>
            </div>
          </RadioGroup>

          {value !== "DEFAULT" && (
            <div>
              <p className="mt-2 mb-1 font-bold">Leyenda</p>

              <div className="flex flex-col gap-1">
                {value === "ENROLL" && (
                  <>
                    <Badge className="bg-green-100" variant="secondary">
                      Ya cursada
                    </Badge>
                    <Badge className="bg-yellow-100" variant="secondary">
                      Disponible para matricular
                    </Badge>
                    <Badge className="bg-red-100" variant="secondary">
                      No disponible para matricular
                    </Badge>
                  </>
                )}
                {value === "CRITICAL_ROUTE" && (
                  <>
                    <Badge className="bg-blue-100" variant="secondary">
                      Crítica
                    </Badge>
                    <Badge className="bg-neutral-100" variant="secondary">
                      No crítica
                    </Badge>
                  </>
                )}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </Panel>
  );
}
