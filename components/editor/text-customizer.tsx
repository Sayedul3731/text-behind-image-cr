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
import { BiSolidDuplicate } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import FontStylePicker from "./font-style-picker";

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
    fontStyle: string;
    zIndex: number;
    isFront: boolean;
    isStroke: boolean;
  };
  handleAttributeChange: (id: number, attribute: string, value: any) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (textSet: any) => void;
  className?: string;
  accordionText?: string;
  changeZIndex: (id: number, newZIndex: number, isFront: boolean) => void;
  toggleStroke: (id: number, isStroke: boolean) => void;
  index: number;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({
  textSet,
  handleAttributeChange,
  removeTextSet,
  duplicateTextSet,
  changeZIndex,
  toggleStroke,
  index,
}) => {
  const [currentFontStyle, setCurrentFontStyle] = useState<string | null>(
    textSet.fontStyle || ""
  );
  const handleTextUp = (id: number, zIndex: number, isFront: boolean) => {
    changeZIndex(id, zIndex, isFront);
  };
  const handleTextBelow = (id: number, zIndex: number, isFront: boolean) => {
    changeZIndex(id, zIndex, isFront);
  };
  const handleFontStyleChange = (style: string) => {
    setCurrentFontStyle(style);
    handleAttributeChange(textSet.id, "fontStyle", style); // Update the font style in parent component
  };
  const handleStrokeShow = (id: number, isStroke: boolean) => {
    toggleStroke(id, isStroke);
  };
  const handleStrokeHide = (id: number, isStroke: boolean) => {
    toggleStroke(id, isStroke);
  };
  return (
    <AccordionItem value={`item-${index + 1}`} className="w-full text-[12px]">
      <AccordionTrigger>{textSet.text}</AccordionTrigger>
      <AccordionContent className="pt-10 md:pt-20 px-14">
        {/* text heading edit */}
        <div className=" flex justify-between items-center ">
          <div className="w-[60%] bg-gradient-to-r from-[#F9DB43] to-[#FD495E] p-[1px] rounded-md text-[10px]">
            <InputField
              attribute="text"
              label="Text"
              currentValue={textSet.text}
              placeholder="Text Here"
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>
          <div className="flex items-center w-[28%] gap-3">
            {textSet.isFront === true ? (
              <div
                onClick={() => handleTextBelow(textSet.id, 0, false)}
                className="w-5 h-5 rounded-sm bg-white flex justify-center items-center"
              >
                <span className="text-black ml-[0.7px]">
                  <GiCheckMark />
                </span>
              </div>
            ) : (
              <div
                onClick={() => handleTextUp(textSet.id, 50, true)}
                className="w-5 h-5 rounded-sm bg-white flex justify-center items-center"
              >
                <span className="text-black ml-[0.7px]"></span>
              </div>
            )}
            <span className="uppercase text-nowrap text-[13px]">
              Text front
            </span>
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
            <FontStylePicker
              currentFontStyle={currentFontStyle}
              handleFontStyleChange={handleFontStyleChange}
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
        <div className="border-b-[2px] w-full pt-10 border-gray-500"></div>
        {/* stroke color  */}
        <div className="flex justify-between items-center mt-16 ">
          <div className="flex items-center gap-5 w-1/2 ">
            {textSet.isStroke === true ? (
              <div
                onClick={() => handleStrokeHide(textSet.id, false)}
                className="w-5 h-5 rounded-sm bg-white flex justify-center items-center"
              >
                <span className="text-black ml-[0.7px]">
                  <GiCheckMark />
                </span>
              </div>
            ) : (
              <div
                onClick={() => handleStrokeShow(textSet.id, true)}
                className="w-5 h-5 rounded-sm bg-white flex justify-center items-center"
              >
                <span className="text-black ml-[0.7px]"></span>
              </div>
            )}
            <span>Stroke</span>
          </div>
          {textSet.isStroke === true && (
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
          )}
        </div>
        <div className="min-h-[100px]">
          {" "}
          {textSet?.isStroke === true ? (
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
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-row pr-20 lg:ml-[12rem] gap-12  z-50 top-[92%]">
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
