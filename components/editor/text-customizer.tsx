import React, { useState } from "react";
import InputField from "./input-field";
import SliderField from "./slider-field";
import ColorPicker from "./color-picker";
import FontFamilyPicker from "./font-picker";
import { Button } from "../ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdOutlineCheckBox } from "react-icons/md";
import { number, string } from "zod";
import { GiCheckMark } from "react-icons/gi";
import FontWeightPicker from "./font-weight-picker";
import { BiSolidDuplicate } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

interface TextCustomizerProps {
  textSet: {
    id: number;
    text: string;
    fontFamily: string;
    top: number;
    left: number;
    color: string;
    fontSize: number;
    fontWeight: number;
    opacity: number;
    rotation: number;
    shadowColor: string;
    shadowSize: number;
    strokeSize: number;
    strokeOpacity: number;
    strokeColor: string;
  };
  handleAttributeChange: (id: number, attribute: string, value: any) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (textSet: any) => void;
  className?: string;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({
  textSet,
  handleAttributeChange,
  removeTextSet,
  duplicateTextSet,
}) => {
  const [currentFontWeight, setCurrentFontWeight] = useState<string | number>(
    textSet.fontWeight
  );
  return (
    <AccordionItem value={`item-${textSet.id}`} className="w-full text-[12px]">
      <AccordionTrigger>{textSet.text}</AccordionTrigger>
      <AccordionContent className="py-20 px-14">
        {/* text heading edit */}
        <div className=" flex justify-between items-center ">
          <div className="w-[60%] bg-gradient-to-r from-[#F9DB43] to-[#FD495E] p-[1px] rounded-md text-[10px]">
            <InputField
              attribute="text"
              label="Text"
              currentValue={textSet.text}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className="flex items-center w-[28%] gap-3">
            <div className="w-5 h-5 rounded-sm bg-white flex justify-center items-center">
              <span className="text-black ml-[0.7px]">
                <GiCheckMark />
              </span>
            </div>
            <span className="uppercase text-lg">Text front</span>
          </div>
        </div>
        {/* font family and text color  */}
        <div className="flex justify-between items-center mt-3 gap-2 ">
          <div className=" w-[33%] ">
            <FontFamilyPicker
              attribute="fontFamily"
              currentFont={textSet.fontFamily}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className="w-[33%]">
            <FontWeightPicker
              currentFontWeight={String(currentFontWeight)}
              handleFontWeightChange={(newWeight) =>
                setCurrentFontWeight(newWeight)
              }
            />
          </div>
          <div className="flex flex-row items-start justify-start w-[33%]">
            <ColorPicker
              attribute="color"
              label="Text Color"
              currentColor={textSet.color}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
        </div>
        <SliderField
          attribute="fontSize"
          label="Text Size"
          min={10}
          max={800}
          step={1}
          currentValue={textSet.fontSize}
          handleAttributeChange={(attribute, value) =>
            handleAttributeChange(textSet.id, attribute, value)
          }
        />
        <SliderField
          attribute="fontWeight"
          label="Font Weight"
          min={100}
          max={900}
          step={100}
          currentValue={textSet.fontWeight}
          handleAttributeChange={(attribute, value) =>
            handleAttributeChange(textSet.id, attribute, value)
          }
        />
        <div className="flex justify-between items-center gap-5 ">
          <div className=" w-1/2">
            <SliderField
              attribute="left"
              label="X Position"
              min={-200}
              max={200}
              step={1}
              currentValue={textSet.left}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className=" w-1/2">
            <SliderField
              attribute="top"
              label="Y Position"
              min={-100}
              max={100}
              step={1}
              currentValue={textSet.top}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className="w-[158%] h-[1px] -ml-[10.2%] mt-[70%] bg-gray-500 absolute"></div>
        </div>
        <SliderField
          attribute="rotation"
          label="Rotation"
          min={-360}
          max={360}
          step={1}
          currentValue={textSet.rotation}
          handleAttributeChange={(attribute, value) =>
            handleAttributeChange(textSet.id, attribute, value)
          }
        />
        <SliderField
          attribute="opacity"
          label="Text Opacity"
          min={0}
          max={1}
          step={0.01}
          currentValue={textSet.opacity}
          handleAttributeChange={(attribute, value) =>
            handleAttributeChange(textSet.id, attribute, value)
          }
        />
        {/* stroke color  */}
        <div className="flex justify-between items-center mt-16 ">
          <div className="flex items-center gap-5 w-1/2 ">
            <div className="w-5 h-5 rounded-sm bg-white flex justify-center items-center">
              <span className="text-black ml-[0.7px]">
                <GiCheckMark />
              </span>
            </div>
            <span>Stroke</span>
          </div>
          <div className="flex justify-center items-center gap-2  w-1/2">
            <span className="text-nowrap">Stroke Color</span>
            <ColorPicker
              attribute="strokeColor"
              label=""
              currentColor={textSet.strokeColor}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-5 ">
          <div className=" w-1/2">
            <SliderField
              attribute="strokeSize"
              label="Stroke Size"
              min={0}
              max={20}
              step={0.5}
              currentValue={textSet.strokeSize}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className=" w-1/2">
            <SliderField
              attribute="strokeOpacity"
              label="Stroke Opacity"
              min={0}
              max={1}
              step={0.01}
              currentValue={textSet.strokeOpacity}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
        </div>
        <div className="flex flex-row gap-12 my-8 absolute top-[91.5%] left-[45%] ">
          <div className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md">
            <Button
              onClick={() => duplicateTextSet(textSet)}
              className="bg-black text-white"
            >
              <span className="text-lg">
                <BiSolidDuplicate />
              </span>
              Duplicate Text
            </Button>
          </div>
          <div className=" bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md">
            <Button
              onClick={() => removeTextSet(textSet.id)}
              className="bg-black text-white"
            >
              <span className="text-lg">
                <RiDeleteBinLine />
              </span>
              Remove Text Layer
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TextCustomizer;
