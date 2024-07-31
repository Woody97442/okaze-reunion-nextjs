import React, { useState, useTransition } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaXmark } from "react-icons/fa6";
import { TbCamera } from "react-icons/tb";
import FindAdminContext from "@/lib/admin-context-provider";

export default function ScrollAreaPost() {
  const {
    allPosts,
    setAllPosts,
    allCategories,
    allAttributes,
    currentCategoriesForPost,
    setCurrentCategoriesForPost,
    currentAttributsForPost,
    setCurrentAttributsForPost,
  } = FindAdminContext();
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);

  const HandleAddImageToPost = (file: File) => {
    setDisabled(true);
    startTransition(() => {
      compressImagePost(file).then((dataImageCompressed) => {
        if (dataImageCompressed) {
          const postTableFile: PropsImagesPost = {
            file: dataImageCompressed,
            fileUrl: URL.createObjectURL(dataImageCompressed),
          };
          const tempFiles = [...currentFilePosts, postTableFile];
          setCurrentFilePosts(tempFiles);
          setDisabled(false);
        }
      });
    });
  };
  return (
    <>
      <ScrollArea className="  whitespace-nowrap">
        <div className="flex space-x-4 w-max p-4 pb-6">
          {currentFilePosts.length > 0 &&
            currentFilePosts.map((file, index) => (
              <div
                className="relative transition-transform duration-300 ease-in-out transform hover:scale-105"
                key={index}>
                <Image
                  alt="preview de l'image de l'annonce"
                  className="rounded-md w-40 h-40 object-cover"
                  width="160"
                  height="160"
                  src={file.fileUrl}
                />
                <Button
                  variant={"ghost"}
                  disabled={isPending}
                  onClick={() => {
                    setCurrentFilePosts(
                      currentFilePosts.filter((f) => f.fileUrl !== file.fileUrl)
                    );
                  }}
                  className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                  <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-white" />
                </Button>
              </div>
            ))}
          <div className="w-[160px] h-[160px] border-2 border-dashed rounded-md flex items-center justify-center">
            <TbCamera className="w-[34px] h-[34px]" />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-row space-x-4 items-center">
        <Input
          className="cursor-pointer w-auto"
          type="file"
          name="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file && file.size > 0 && file.type.includes("image")) {
              HandleAddImageToPost(file);
            }
          }}
        />
        <span className="text-sm font-bold">
          Nombre d'images : {currentFilePosts.length}
        </span>
      </div>
    </>
  );
}
