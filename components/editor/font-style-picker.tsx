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

const fontStyles = [
  "Normal",
  "Italic",
  "Oblique",
  "Small Caps",
  "All Caps",
  "Underline",
  "Strikethrough",
  "Bold",
  "Light",
  "Medium",
  "Condensed",
  "Expanded",
  "Shadow",
  "Outline",
  "Superscript",
  "Subscript",
  "Highlight",
  "Raised",
  "Lowered",
];

interface FontStylePickerProps {
  currentFontStyle: string | null;
  handleFontStyleChange: (style: string) => void;
}

const FontStylePicker: React.FC<FontStylePickerProps> = ({
  currentFontStyle,
  handleFontStyleChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <Popover>
        <div className="flex flex-col items-start justify-start">
          <Label>Font Style</Label>
          <PopoverTrigger asChild>
            <div className="w-full mt-1 bg-gradient-to-r from-[#F9DB43] to-[#FD495E] p-[1px] rounded-md">
              <div
                className={cn(
                  "w-[99.8%] justify-between border-none p-2 flex rounded-md bg-black mx-auto",
                  !currentFontStyle && "text-muted-foreground"
                )}
              >
                {currentFontStyle || "Select font style"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-100" />
              </div>
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search font style..." className="h-9" />
            <CommandList>
              <CommandEmpty>No font style found.</CommandEmpty>
              <CommandGroup>
                {fontStyles.map((style) => (
                  <CommandItem
                    value={style}
                    key={style}
                    onSelect={() => handleFontStyleChange(style)}
                    className="hover:cursor-pointer"
                  >
                    {style}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        style === currentFontStyle ? "opacity-100" : "opacity-0"
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

export default FontStylePicker;
