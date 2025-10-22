"use client";

import { Icon } from "@iconify/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxProps<T> {
  itemValue: (item: T) => string | number;
  itemLabel: (item: T) => string;
  items: T[];
  value?: T;
  onChange: (value?: T) => void;
  searchPlaceholder?: string;
  comboboxPlaceholder?: string;
  notFoundText?: string;
}

export function Combobox<T>({
  itemValue,
  itemLabel,
  items,
  value,
  onChange,
  searchPlaceholder = "Buscar...",
  comboboxPlaceholder = "Seleccionar...",
  notFoundText = "Sin resultados",
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? itemLabel(value) : comboboxPlaceholder}
          <Icon
            icon="material-symbols:expand-all-rounded"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={itemValue(item)}
                  onSelect={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Icon
                    icon="material-symbols:check-rounded"
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === index ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {itemLabel(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
