"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FindAdminContext from "@/lib/admin-context-provider";
import { UploadIcon } from "@/actions/admin/upload-icon";
import { CreateCategory } from "@/actions/admin/categories";
import { toast } from "../ui/use-toast";
import { Category } from "@/prisma/category/types";
import { FaArrowDown, FaXmark } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Post } from "@/prisma/post/types";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import LoaderOkaze from "../utils/loader";

export default function CreateCategoryForm({ variant }: { variant?: boolean }) {
  const { allCategories, setAllCategories, currentPost, setCurrentPost } =
    FindAdminContext();

  const [labelNewCategory, setLabelNewCategory] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentFileIcon, setCurrentFileIcon] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [currentIcon, setCurrentIcon] = useState<string>("");

  const CreateNewCategory = () => {
    if (labelNewCategory) {
      setOpen(false);
      startTransition(() => {
        if (currentFileIcon) {
          const formData = new FormData();
          formData.append("file", currentFileIcon);

          UploadIcon(formData, labelNewCategory).then((data) => {
            if (data) {
              if (data?.success) {
                const iconUrl = data.url;
                if (iconUrl) {
                  CreateCategory(labelNewCategory, iconUrl).then((data) => {
                    if (data?.success) {
                      setLabelNewCategory("");
                      setCurrentFileIcon(null);
                      const newCategories = [
                        ...(allCategories as Category[]),
                        data.category,
                      ];
                      setAllCategories(newCategories);
                      const addCategories = [
                        ...(currentPost?.categories || []),
                        data.category,
                      ];
                      const updateCurrentPost = {
                        ...currentPost,
                        categories: addCategories,
                      };
                      setCurrentPost(updateCurrentPost as Post);
                      toast({
                        title: "Succès",
                        description: data?.success,
                      });
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: data?.error,
                      });
                    }
                  });
                } else {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description:
                      "Une erreur est survenue pendant l'upload de l'icône !",
                  });
                }
              } else {
                toast({
                  variant: "destructive",
                  title: "Erreur",
                  description: data?.error,
                });
              }
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue !",
              });
            }
          });
        } else {
          CreateCategory(labelNewCategory).then((data) => {
            if (data?.success) {
              setLabelNewCategory("");
              setCurrentFileIcon(null);
              const newCategories = [
                ...(allCategories as Category[]),
                data.category,
              ];
              setAllCategories(newCategories);
              const addCategories = [
                ...(currentPost?.categories || []),
                data.category,
              ];
              const updateCurrentPost = {
                ...currentPost,
                categories: addCategories,
              };
              setCurrentPost(updateCurrentPost as Post);
              toast({
                title: "Succès",
                description: data?.success,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
            }
          });
        }
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie ne doit pas étre vide !",
      });
    }
  };

  return (
    <>
      {variant ? (
        <>
          <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger className="w-full md:w-auto">
              <div className="text-white bg-secondary rounded-md px-3 py-2 flex gap-2">
                <MdOutlineAddCircleOutline className="w-6 h-6" />
                <span className="hidden md:block">Nouvelle catégorie</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer une catégorie</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 py-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-left">
                    Nom de la catégorie
                  </Label>
                  <Input
                    className="col-span-3"
                    onChange={(e) => setLabelNewCategory(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-left w-full flex flex-row justify-between items-center">
                    Ajouter une icone a la catégorie
                  </Label>
                  <Input
                    className="cursor-pointer w-auto"
                    type="file"
                    name="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, image/avif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (
                        file &&
                        file.size > 0 &&
                        file.type.includes("image")
                      ) {
                        const PreviewFile = URL.createObjectURL(file);
                        setCurrentIcon(PreviewFile);
                        setCurrentFileIcon(file);
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label
                    htmlFor="name"
                    className="text-left">
                    prévisualisation de la catégorie
                  </Label>
                  <div className="flex flex-row items-center gap-4 p-2 bg-gray-100 w-fit">
                    <Image
                      alt="preview"
                      width={42}
                      height={42}
                      className="w-[42px] h-[42px]"
                      src={currentIcon || "/images/other.png"}
                    />
                    <span>{labelNewCategory || "exemple"}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={CreateNewCategory}
                disabled={isPending}>
                Créer
              </Button>
            </DialogContent>
          </Dialog>
          {isPending && (
            <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0">
              <LoaderOkaze variant="light" />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="font-bold">Sélectionnez les catégories</div>
          <Select
            onValueChange={(field) => {
              const selectedCategory = allCategories?.find(
                (category) => category.id === field
              );
              if (selectedCategory) {
                const addCategories = [
                  ...(currentPost?.categories || []),
                  selectedCategory,
                ];
                const updateCurrentPost = {
                  ...currentPost,
                  categories: addCategories,
                };
                setCurrentPost(updateCurrentPost as Post);
              }
            }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={""} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allCategories?.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}>
                    <div className="flex flex-row items-center gap-x-4">
                      <Image
                        alt={category.altIcon || category.name}
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px]"
                        src={category.icon || "/images/other.png"}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-row items-center justify-between font-bold">
            <div className="flex flex-row items-center gap-x-2">
              Catégories <FaArrowDown />
            </div>
            <Dialog
              open={open}
              onOpenChange={setOpen}>
              <DialogTrigger>
                <div className="text-white bg-secondary rounded-md px-3 py-2 flex gap-2">
                  <MdOutlineAddCircleOutline className="w-6 h-6" />
                  <span className="hidden md:block">Nouvelle catégorie</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer une catégorie</DialogTitle>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="name"
                      className="text-left">
                      Nom de la catégorie
                    </Label>
                    <Input
                      className="col-span-3"
                      onChange={(e) => setLabelNewCategory(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="name"
                      className="text-left w-full flex flex-row justify-between items-center">
                      Ajouter une icone a la catégorie
                    </Label>
                    <Input
                      className="cursor-pointer w-auto"
                      type="file"
                      name="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, image/avif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (
                          file &&
                          file.size > 0 &&
                          file.type.includes("image")
                        ) {
                          const PreviewFile = URL.createObjectURL(file);
                          setCurrentIcon(PreviewFile);
                          setCurrentFileIcon(file);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label
                      htmlFor="name"
                      className="text-left">
                      prévisualisation de la catégorie
                    </Label>
                    <div className="flex flex-row items-center gap-4 p-2 bg-gray-100 w-fit">
                      <Image
                        alt="preview"
                        width={42}
                        height={42}
                        className="w-[42px] h-[42px]"
                        src={currentIcon || "/images/other.png"}
                      />
                      <span>{labelNewCategory || "exemple"}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={CreateNewCategory}
                  disabled={isPending}>
                  Créer
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col space-y-3 border border-slate-300 rounded-md p-3 min-h-[100px]">
            {currentPost &&
              currentPost.categories &&
              currentPost?.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-row items-center gap-x-2">
                  <FaXmark
                    className="cursor-pointer h-4 w-4 text-red-500"
                    onClick={() => {
                      const newCategories = currentPost?.categories?.filter(
                        (c) => c.id !== category.id
                      );
                      setCurrentPost({
                        ...currentPost,
                        categories: newCategories,
                      } as Post);
                    }}
                  />
                  <div className=" font-bold">
                    <div className="flex flex-row items-center gap-x-4">
                      <Image
                        alt={category.altIcon || category.name}
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px]"
                        src={category.icon || "/images/other.png"}
                      />
                      {category.name}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {isPending && (
            <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0">
              <LoaderOkaze variant="light" />
            </div>
          )}
        </>
      )}
    </>
  );
}
