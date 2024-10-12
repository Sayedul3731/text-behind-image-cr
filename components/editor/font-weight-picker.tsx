"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const fontWeights = [
  "100 (Thin)",
  "200 (Extra Light)",
  "300 (Light)",
  "400 (Regular)",
  "500 (Medium)",
  "600 (Semi Bold)",
  "700 (Bold)",
  "800 (Extra Bold)",
  "900 (Black)",
];

interface FontWeightPickerProps {
  currentFontWeight: string;
  handleFontWeightChange: (weight: string) => void;
}

const FontWeightPicker: React.FC<FontWeightPickerProps> = ({
  currentFontWeight,
  handleFontWeightChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <Popover>
        <div className="flex flex-col items-start justify-start">
          <Label>Font Weight</Label>
          <PopoverTrigger asChild>
            <div className="w-full mt-1 bg-gradient-to-r from-[#F9DB43] to-[#FD495E] p-[1px]  rounded-md">
              <div
                className={cn(
                  "w-[99.8%] justify-between border-none p-2 flex rounded-md bg-black mx-auto",
                  !currentFontWeight && "text-muted-foreground"
                )}
              >
                {currentFontWeight || "Select font weight"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-100" />
              </div>
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search font weight..." className="h-9" />
            <CommandList>
              <CommandEmpty>No font weight found.</CommandEmpty>
              <CommandGroup>
                {fontWeights.map((weight) => (
                  <CommandItem
                    value={weight}
                    key={weight}
                    onSelect={() => handleFontWeightChange(weight)}
                    className="hover:cursor-pointer"
                  >
                    {weight}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        weight === currentFontWeight
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FontWeightPicker;
