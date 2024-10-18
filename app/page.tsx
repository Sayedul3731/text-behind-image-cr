"use client";

import React, { useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Authenticate from "@/components/authenticate";
import { Button } from "@/components/ui/button";
import { removeBackground } from "@imgly/background-removal";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import TextCustomizer from "@/components/editor/text-customizer";
import Image from "next/image";
import { Accordion } from "@/components/ui/accordion";
import "@/app/fonts.css";
import { LuUpload } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { CiSaveDown2 } from "react-icons/ci";
import Player from "lottie-react";
import loadingAnimation from "../public/animation.json";
import { RiDeleteBinLine } from "react-icons/ri";
import "../app/page";

const Page = () => {
  type TextSet = {
    id: number;
    text: string;
    fontFamily: string;
    top: number;
    left: number;
    color: string;
    strokeColor: string;
    fontSize: number;
    fontWeight: number;
    opacity: number;
    shadowColor: string;
    shadowSize: number;
    rotation: number;
    strokeSize: number;
    strokeOpacity: number;
    fontStyle: string;
    visible: boolean;
    zIndex: number;
    isFront: boolean;
    isStroke: boolean;
  };

  const { user } = useUser();
  const { session } = useSessionContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  // const [textSets, setTextSets] = useState<Array<any>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const changeZIndex = (id: number, newZIndex: number, isFront: boolean) => {
    setTextSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, zIndex: newZIndex, isFront } : set
      )
    );
  };
  const toggleStroke = (id: number, isStroke: boolean) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, isStroke } : set))
    );
  };

  const [textSets, setTextSets] = useState<TextSet[]>([
    {
      id: 1,
      text: "Text 1",
      fontFamily: "Inter",
      top: 0,
      left: 0,
      color: "#F9DB43",
      strokeColor: "red",
      fontSize: 200,
      fontWeight: 800,
      opacity: 1,
      shadowColor: "rgba(0, 0, 0, 0.8)",
      shadowSize: 4,
      rotation: 0,
      strokeSize: 2,
      strokeOpacity: 0.5,
      fontStyle: "normal",
      zIndex: 0,
      isFront: false,
      visible: true,
      isStroke: false,
    },
  ]);
  const [strokeEffectLayers, setStrokeEffectLayers] = useState<
    Record<number, boolean>
  >({});

  const handleToggleVisibility = (id: number): void => {
    const updatedTextSets = textSets.map((textSet) =>
      textSet.id === id ? { ...textSet, visible: !textSet.visible } : textSet
    );
    setTextSets(updatedTextSets);
  };
  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage(null);
      setIsLoading(true);

      const imageUrl = URL.createObjectURL(file);

      setTimeout(() => {
        setSelectedImage(imageUrl);
        setIsLoading(false);
        setupImage(imageUrl);
      }, 100);
    }
  };

  const setupImage = async (imageUrl: string) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    const newLayerName = `Text ${newId}`;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: newLayerName,
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "#F9DB43",
        strokeColor: "red",
        fontSize: 100,
        fontWeight: 800,
        opacity: 1,
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowSize: 4,
        rotation: 0,
        strokeSize: 2,
        strokeOpacity: 0.5,
        fontStyle: "normal",
        isFront: false,
        zIndex: 0,
        visible: true,
        isStroke: false,
      },
    ]);
  };

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [attribute]: value } : set))
    );
  };

  const duplicateTextSet = (textSet: any) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [...prev, { ...textSet, id: newId }]);
  };

  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  const saveCompositeImage = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // Set canvas size to match the background image
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw the background image
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Loop through each textSet and draw the text on the canvas
      textSets.forEach((textSet) => {
        ctx.save();

        // Apply font settings
        const fontStyle = textSet.fontStyle.toLowerCase();
        const fontWeight = ["bold", "light", "medium"].includes(fontStyle)
          ? fontStyle
          : textSet.fontWeight;
        ctx.font = `${
          fontStyle === "italic" ? "italic" : "normal"
        } ${fontWeight} ${textSet.fontSize * 3}px ${textSet.fontFamily}`;

        // Set fill color and opacity
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center"; // Center-align the text
        ctx.textBaseline = "middle"; // Set the text baseline to middle

        // Calculate the position without clipping the text
        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (30 - textSet.top)) / 100;

        // Rotate text around its own center
        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        // Draw the main text
        ctx.fillText(textSet.text, 0, 0);

        // Handle underline and strikethrough
        const textWidth = ctx.measureText(textSet.text).width;
        if (textSet.fontStyle.toLowerCase() === "underline") {
          ctx.beginPath();
          ctx.moveTo(-textWidth / 2, 5); // Adjust for the underline position
          ctx.lineTo(textWidth / 2, 5);
          ctx.strokeStyle = textSet.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (textSet.fontStyle.toLowerCase() === "strikethrough") {
          ctx.beginPath();
          ctx.moveTo(-textWidth / 2, 0); // Adjust for the strikethrough position
          ctx.lineTo(textWidth / 2, 0);
          ctx.strokeStyle = textSet.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw shadow if enabled
        if (textSet.fontStyle.toLowerCase() === "shadow") {
          ctx.shadowColor = textSet.color;
          ctx.shadowBlur = 10;
          ctx.fillText(textSet.text, 0, 0);
        }

        // Draw stroke if specified
        if (textSet.strokeSize > 0) {
          ctx.lineWidth = textSet.strokeSize;
          ctx.strokeStyle = textSet.strokeColor;
          ctx.globalAlpha = textSet.strokeOpacity;
          ctx.strokeText(textSet.text, 0, 0);
        }

        ctx.restore();
      });

      // Draw the removed background image on top if available
      if (removedBgImageUrl) {
        const removedBgImg = new (window as any).Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          triggerDownload();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        triggerDownload();
      }
    };
    bgImg.src = selectedImage || "";

    function triggerDownload() {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "easy-text-behind.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="bg-black w-full min-h-screen text-white relative">
      <div className="absolute w-[10%] md:w-[30%] h-[20%] lg:h-[50%] inset-0  bg-gradient-to-br from-[#FACF4680] rounded-br-full  opacity-5"></div>

      {/* logo and profile img here  */}
      <div className="flex justify-between items-center px-5 md:px-20 py-5">
        <div className="relative">
          <div className="logo-text">
            {/* <Image
              src="https://i.ibb.co.com/2vQ2tY8/logo.png"
              width={400}
              height={100}
              alt="logo"
              className="w-[150px] md:w-[250px]"
            ></Image> */}
            <img
              src="/logo.png"
              alt="logo"
              className="w-[150px] md:w-[250px]"
            />
          </div>
        </div>

        <div>
          <img
            width={500}
            height={50}
            className="size-16 rounded-full bg-slate-500 object-cover"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
            alt="avatar navigate ui"
          />
        </div>
      </div>

      {selectedImage && !isImageSetupDone ? (
        <div className="w-full h-[70vh] flex justify-center items-center mx-auto">
          <span className="flex items-center w-full h-full justify-center gap-2">
            <Player
              autoplay
              loop
              animationData={loadingAnimation}
              style={{ height: "100px", width: "100px" }}
            />
          </span>
        </div>
      ) : selectedImage && isImageSetupDone ? (
        <div className="flex flex-col md:flex-row items-start justify-start gap-40 w-[90%] mx-auto min-h-screen p-10">
          {/* img div here  */}
          <div className="w-[45vw] h-[300px] md:w-[500px] md:h-[400px] lg:w-[600px] lg:h-[500px] ml-[16%] md:ml-[0%]  rounded-lg relative overflow-hidden ">
            <div className="">
              {isImageSetupDone ? (
                <div className="w-full h-full ">
                  <Image
                    src={selectedImage}
                    alt="Uploaded"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                ""
              )}
              {isImageSetupDone &&
                textSets.map((textSet) => (
                  <div
                    key={textSet.id}
                    style={{
                      position: "absolute",
                      top: `${50 - textSet.top}%`,
                      left: `${textSet.left + 50}%`,
                      transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                      color: textSet.color,
                      textAlign: "center",
                      fontSize: `${textSet.fontSize}px`,
                      fontWeight: textSet.fontWeight,
                      fontFamily: textSet.fontFamily,
                      opacity: textSet.opacity,
                      overflow: "hidden",
                      fontStyle: textSet.fontStyle,
                      zIndex: textSet.zIndex,
                      textShadow:
                        textSet.isStroke === true
                          ? `${textSet.strokeColor} 1px 1px ${textSet.strokeSize}px`
                          : "none",
                      strokeOpacity: textSet.strokeOpacity,
                      // maxWidth: `${imgWidth * 0.9}px`,
                    }}
                  >
                    {textSet.visible ? textSet.text : ""}
                  </div>
                ))}
              {removedBgImageUrl && (
                <Image
                  src={removedBgImageUrl}
                  alt="Removed bg"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="absolute top-0 left-0 w-full h-full"
                />
              )}
            </div>
          </div>
          <div className="absolute top-[45%] ml-[20%]   md:top-[50%] lg:top-[65%] w-1/3 flex justify-center md:-ml-[3%] lg:-ml-[7%]">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
            )}

            {isImageSetupDone && (
              <Button
                onClick={handleUploadImage}
                className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md py-8 px-16"
              >
                <LuUpload /> Add New Picture
              </Button>
            )}
          </div>
          {/* text content here  */}
          {isImageSetupDone && (
            <div className="flex flex-col w-full md:-mt-16">
              <div className="flex justify-center items-center min-h-[100px]">
                <div className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md w-3/5 md:w-2/5 md:h-20">
                  <Button
                    className="py-8 bg-black text-white w-[99%] h-[95%]"
                    onClick={addNewTextSet}
                  >
                    <PlusIcon /> Add New Text
                  </Button>
                </div>
              </div>
              <Accordion
                type="multiple"
                defaultValue={[
                  "item-1",
                  "item-2",
                  "item-3",
                  "item-4",
                  "item-5",
                ]}
                className="mt-2"
              >
                {textSets.map((textSet, index) => (
                  <div
                    key={index}
                    className="flex gap-3 cursor-pointer w-full md:w-1/2 relative"
                  >
                    <span
                      onClick={() => handleToggleVisibility(textSet.id)}
                      className="text-xl mt-3.5"
                    >
                      {textSet.visible ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </span>
                    <div
                      onClick={() => removeTextSet(textSet.id)}
                      className="absolute top-4 -right-6"
                    >
                      <RiDeleteBinLine />
                    </div>
                    <TextCustomizer
                      textSet={textSet}
                      handleAttributeChange={handleAttributeChange}
                      removeTextSet={removeTextSet}
                      duplicateTextSet={duplicateTextSet}
                      changeZIndex={changeZIndex}
                      toggleStroke={toggleStroke}
                      index={index}
                    />
                  </div>
                ))}
              </Accordion>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div
                className={`flex justify-center items-center pt-16  transition-all duration-300 lg:-ml-[15%] mt-10 `}
              >
                <Button
                  onClick={saveCompositeImage}
                  className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md"
                >
                  <CiSaveDown2 /> Save image
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="flex justify-center items-center w-[80vw] h-[25vh] md:w-[70vw] md:h-[40vh] lg:w-[40vw] lg:h-[50vh] rounded-md border-2 border-dashed border-[#F9DB43]">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
            />

            <Button
              onClick={handleUploadImage}
              className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md px-14 py-8 cursor-pointer"
            >
              <LuUpload /> Add Picture
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
