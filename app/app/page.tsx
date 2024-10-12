// app/app/page.tsx
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

const Page = () => {
  const { user } = useUser();
  const { session } = useSessionContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleAccordionToggle = (id: number) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
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
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      await setupImage(imageUrl);
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
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "Layer - 1",
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "white",
        strokeColor: "#ff0000",
        fontSize: 200,
        fontWeight: 800,
        opacity: 1,
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowSize: 4,
        rotation: 0,
        strokeSize: 2,
        strokeOpacity: 0.5,
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
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      textSets.forEach((textSet) => {
        ctx.save();
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize * 3}px ${
          textSet.fontFamily
        }`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
        ctx.fillText(textSet.text, 0, 0);
        if (textSet.strokeSize > 0) {
          ctx.lineWidth = textSet.strokeSize;
          ctx.strokeStyle = textSet.color;
          ctx.strokeStyle = textSet.strokeColor;
          ctx.globalAlpha = textSet.strokeOpacity;
          ctx.strokeText(textSet.text, textSet.left, textSet.top);
        }

        ctx.globalAlpha = textSet.opacity;

        ctx.fillText(textSet.text, 0, 0);
        ctx.restore();
      });

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
      link.download = "text-behind-image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <>
      {user && session && session.user ? (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row items-center justify-between p-5 px-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Text behind image editor
            </h2>
            <div className="flex gap-4">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
              <Button onClick={handleUploadImage}>Upload image</Button>
              <Avatar>
                <AvatarImage src={user?.user_metadata.avatar_url} />
              </Avatar>
            </div>
          </div>
          <Separator />
          {selectedImage ? (
            <div className="flex flex-row items-start justify-start gap-10 w-full h-screen p-10">
              <div className="min-h-[400px] w-[80%] p-4 border border-border rounded-lg relative overflow-hidden">
                {isImageSetupDone ? (
                  <Image
                    src={selectedImage}
                    alt="Uploaded"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                  />
                ) : (
                  <span className="flex items-center w-full gap-2">
                    <ReloadIcon className="animate-spin" /> Loading, please wait
                  </span>
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
                        WebkitTextStroke: `${textSet.strokeSize}px ${textSet.color}`,
                      }}
                    >
                      {textSet.text}
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
              <div className="flex flex-col w-full">
                <Button variant={"secondary"} onClick={addNewTextSet}>
                  <PlusIcon className="mr-2" /> Add New Text
                </Button>
                <Accordion type="single" collapsible className="w-full mt-2">
                  {textSets.map((textSet) => (
                    <TextCustomizer
                      key={textSet.id}
                      textSet={textSet}
                      handleAttributeChange={handleAttributeChange}
                      removeTextSet={removeTextSet}
                      duplicateTextSet={duplicateTextSet}
                    />
                  ))}
                </Accordion>

                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Button onClick={saveCompositeImage}>Save image</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-screen w-full">
              <h2 className="text-xl font-semibold">
                Welcome, get started by uploading an image!
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-black w-full min-h-screen text-white">
          <div className="flex justify-between items-center px-20 py-10">
            <div>
              <span className="text-7xl">Logo</span>
            </div>
            <div>
              <div>{/* <Authenticate /> */}</div>
              <img
                width={500}
                height={600}
                className="size-16 rounded-full bg-slate-500 object-cover"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
                alt="avatar navigate ui"
              />
            </div>
          </div>
          {selectedImage ? (
            <div className="flex flex-row items-start justify-start gap-10 w-[90%] mx-auto min-h-screen p-10">
              <div className="min-h-[60vh] w-[50vw] rounded-lg relative overflow-hidden">
                {isImageSetupDone ? (
                  <div>
                    <Image
                      src={selectedImage}
                      alt="Uploaded"
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                    />
                  </div>
                ) : (
                  <span className="flex items-center w-full gap-2">
                    <ReloadIcon className="animate-spin" /> Loading, please wait
                  </span>
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
                      }}
                    >
                      {textSet.text}
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
              <div className="absolute top-[85%] w-1/3 flex justify-center">
                <Button
                  onClick={handleUploadImage}
                  className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md py-8 px-16"
                >
                  <LuUpload /> Add New Picture
                </Button>
              </div>

              <div className="flex flex-col w-full -mt-16">
                <div className="flex justify-center items-center min-h-[100px]">
                  <div className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md w-2/5 h-20">
                    <Button
                      className="py-8 bg-black text-white w-[99%] h-[95%]"
                      onClick={addNewTextSet}
                    >
                      <PlusIcon /> Add New Text
                    </Button>
                  </div>
                </div>
                <Accordion type="single" collapsible className="mt-2 relative">
                  {textSets.map((textSet) => (
                    <div
                      key={textSet.id}
                      className="relative cursor-pointer w-1/2"
                      onClick={() => handleAccordionToggle(textSet.id)}
                    >
                      <span className="absolute -left-7 top-4 text-xl">
                        {openAccordion === textSet.id ? (
                          <AiOutlineEye />
                        ) : (
                          <AiOutlineEyeInvisible />
                        )}
                      </span>
                      <TextCustomizer
                        textSet={textSet}
                        handleAttributeChange={handleAttributeChange}
                        removeTextSet={removeTextSet}
                        duplicateTextSet={duplicateTextSet}
                      />
                    </div>
                  ))}
                </Accordion>

                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div
                  className={`flex justify-center items-center pt-16 ${
                    openAccordion ? "-ml-[10%]" : "-ml-[20%]"
                  } transition-all duration-300`}
                >
                  <Button
                    onClick={saveCompositeImage}
                    className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md"
                  >
                    <CiSaveDown2 /> Save image
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[70vh]">
              <div className="flex justify-center items-center w-[40vw] h-[50vh] rounded-md border-2 border-dashed border-[#F9DB43]">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png"
                />

                <Button
                  onClick={handleUploadImage}
                  className="bg-gradient-to-r from-[#F9DB43] to-[#FD495E] rounded-md px-14 py-8"
                >
                  <LuUpload /> Add Picture
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
