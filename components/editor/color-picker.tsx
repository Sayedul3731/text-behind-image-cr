"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChromePicker } from "react-color";
import { colors } from "@/constants/colors";

interface ColorPickerProps {
  attribute: string;
  label: string;
  currentColor: string;
  handleAttributeChange: (attribute: string, value: any) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  attribute,
  label,
  currentColor,
  handleAttributeChange,
}) => {
  return (
    <div className={`flex flex-col w-full`}>
      <Label htmlFor={attribute}>{label}</Label>

      <div className="flex flex-wrap gap-1 w-full mt-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] w-[130%] p-[1px] h-[38px] rounded-md flex justify-center items-center">
              <div className=" rounded-md flex justify-between items-center py-[5.3px] px-3 w-full gap-5  bg-black ml-[1px]">
                <div className="">
                  <p
                    style={{ background: currentColor }}
                    className="rounded-md h-[25px] w-[25px] cursor-pointer"
                  ></p>
                </div>
                <div className="">{currentColor}</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex flex-col items-center justify-center w-full lg:mt-[342px] lg:ml-[100%]"
            side="left"
            sideOffset={1}
          >
            <Tabs defaultValue="colorPicker">
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger value="colorPicker">🎨</TabsTrigger>
                <TabsTrigger value="suggestions">⚡️</TabsTrigger>
              </TabsList>
              <TabsContent value="colorPicker">
                <ChromePicker
                  color={currentColor}
                  onChange={(color) =>
                    handleAttributeChange(attribute, color.hex)
                  }
                />
              </TabsContent>
              <TabsContent value="suggestions">
                <div className="flex flex-wrap gap-1 mt-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      style={{ background: color }}
                      className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                      onClick={() => handleAttributeChange(attribute, color)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ColorPicker;
