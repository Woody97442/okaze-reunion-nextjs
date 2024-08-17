import React, { useTransition } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaXmark } from "react-icons/fa6";
import { TbCamera } from "react-icons/tb";
import FindAdminContext from "@/lib/admin-context-provider";
import { compressImagePost } from "@/lib/compress-image";
import { Image as ImageType } from "@prisma/client";
import { DeleteImage } from "@/actions/admin/delete-image";
import { toast } from "../ui/use-toast";
import PublishSwitch from "./publish-switch";

interface PropsImagesPost {
  file: File;
  fileUrl: string;
}

export default function ScrollAreaPost() {
  const {
    currentPost,
    setCurrentPost,
    setLoading,
    tempUploadFiles,
    setTempUploadFiles,
  } = FindAdminContext();

  const [isPending, startTransition] = useTransition();

  const HandleAddImageToPost = (file: File) => {
    setLoading(true);
    startTransition(() => {
      compressImagePost(file).then((dataImageCompressed) => {
        if (dataImageCompressed) {
          const postTableFile: PropsImagesPost = {
            file: dataImageCompressed,
            fileUrl: URL.createObjectURL(dataImageCompressed),
          };
          const tempFiles = [...tempUploadFiles, postTableFile];
          setTempUploadFiles(tempFiles);
          setLoading(false);
        }
      });
    });
  };

  const deleteOldImageInThePost = (file: ImageType) => {
    setLoading(true);
    startTransition(() => {
      DeleteImage(file).then((data) => {
        if (data.success) {
          toast({
            variant: "default",
            title: "Succès",
            description: data?.success,
          });
          setLoading(false);
          const postEdited = currentPost;
          if (postEdited) {
            postEdited.images = data.imageInPost;
            setCurrentPost(postEdited);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setLoading(false);
        }
      });
    });
  };

  return (
    <>
      <ScrollArea className="  whitespace-nowrap">
        <div className="flex space-x-4 w-max p-4 pb-6">
          {currentPost &&
            currentPost.images &&
            currentPost.images.length > 0 &&
            currentPost.images.map((file, index) => (
              <div
                className="relative transition-transform duration-300 ease-in-out transform hover:scale-105"
                key={index}>
                <Image
                  alt="preview de l'image de l'annonce"
                  className="rounded-md w-40 h-40 object-cover"
                  width="160"
                  height="160"
                  src={file.src}
                />
                {/* Supprime une image de l'annonce quand on édite l'annonce */}
                <Button
                  variant={"ghost"}
                  disabled={isPending}
                  onClick={() => {
                    deleteOldImageInThePost(file);
                  }}
                  className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                  <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-red-600" />
                </Button>
              </div>
            ))}
          {tempUploadFiles.length > 0 &&
            tempUploadFiles.map((file, index) => (
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
                {/* Supprime une image qui n'est pas encore sauvegardé de l'annonce */}
                <Button
                  variant={"ghost"}
                  disabled={isPending}
                  onClick={() => {
                    setTempUploadFiles(
                      tempUploadFiles.filter((f) => f.fileUrl !== file.fileUrl)
                    );
                  }}
                  className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                  <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-red-600" />
                </Button>
              </div>
            ))}
          <div className="w-[160px] h-[160px] border-2 border-dashed rounded-md flex items-center justify-center">
            <TbCamera className="w-[34px] h-[34px]" />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-row items-center justify-between ">
        <div className="flex flex-row space-x-2 items-center">
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
            <span>Nombre d'images : </span>
            {currentPost && currentPost.images && currentPost.images.length
              ? currentPost.images.length + tempUploadFiles.length
              : tempUploadFiles.length}
          </span>
        </div>
        {currentPost && currentPost.id && (
          <div className="flex flex-row justify-between space-x-4 items-center">
            <span className="text-sm font-bold text-nowrap">
              Activer l'annonce :{" "}
            </span>
            <PublishSwitch
              isActive={currentPost?.isActive}
              idPost={currentPost?.id}
            />
          </div>
        )}
      </div>
    </>
  );
}
