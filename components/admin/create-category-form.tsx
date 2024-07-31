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
import { compressIcon } from "@/lib/compress-image";
import { UploadIcon } from "@/actions/admin/upload-icon";
import { CreateCategory } from "@/actions/admin/categories";
import { toast } from "../ui/use-toast";
import { Category } from "@/prisma/category/types";

export default function CreateCategoryForm() {
  const {
    allCategories,
    setAllCategories,
    currentCategoriesForPost,
    setCurrentCategoriesForPost,
  } = FindAdminContext();

  const [labelNewCategory, setLabelNewCategory] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentFileIcon, setCurrentFileIcon] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [currentIcon, setCurrentIcon] = useState<string>("");

  const CreateNewCategory = () => {
    if (labelNewCategory) {
      startTransition(() => {
        if (currentFileIcon) {
          compressIcon(currentFileIcon as File).then((data) => {
            if (data) {
              const formData = new FormData();
              formData.append("file", data);

              UploadIcon(formData).then((data) => {
                if (data) {
                  if (data?.success) {
                    const iconUrl = data.url;
                    if (iconUrl) {
                      CreateCategory(labelNewCategory, iconUrl).then((data) => {
                        if (data?.success) {
                          setOpen(false);
                          setLabelNewCategory("");
                          setCurrentFileIcon(null);
                          const newCategories = [
                            ...(allCategories as Category[]),
                            data.category,
                          ];
                          setAllCategories(newCategories);
                          setCurrentCategoriesForPost([
                            ...currentCategoriesForPost,
                            data.category,
                          ]);
                          toast({
                            title: "Succès",
                            description: data?.success,
                          });
                          setOpen(false);
                        } else {
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: data?.error,
                          });
                          setOpen(false);
                        }
                      });
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Erreur",
                        description:
                          "Une erreur est survenue pendant l'upload de l'icône !",
                      });
                      setOpen(false);
                    }
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Erreur",
                      description: data?.error,
                    });
                    setOpen(false);
                  }
                } else {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur est survenue !",
                  });
                  setOpen(false);
                }
              });
            }
          });
        } else {
          CreateCategory(labelNewCategory).then((data) => {
            if (data?.success) {
              setOpen(false);
              setLabelNewCategory("");
              setCurrentFileIcon(null);
              const newCategories = [
                ...(allCategories as Category[]),
                data.category,
              ];
              setAllCategories(newCategories);
              setCurrentCategoriesForPost([
                ...currentCategoriesForPost,
                data.category,
              ]);
              toast({
                title: "Succès",
                description: data?.success,
              });
              setOpen(false);
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
              setOpen(false);
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
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="text-white bg-secondary rounded-md px-3 py-2">
            Nouvelle catégorie
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
                <span className="text-sm text-muted-foreground">
                  (2Mo maximum)
                </span>
              </Label>
              <Input
                className="cursor-pointer w-auto"
                type="file"
                name="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, image/avif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size > 0 && file.type.includes("image")) {
                    const PreviewFile = URL.createObjectURL(file);
                    setCurrentIcon(PreviewFile);
                    setCurrentFileIcon(file);
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                L'icône sera redimensionnée à 42x42.
              </span>
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
    </>
  );
}
