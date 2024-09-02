"use client";

import React, { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import FindAdminContext from "@/lib/admin-context-provider";
import Image from "next/image";
import { Label } from "../ui/label";
import { UpdatedCategory } from "@/actions/admin/categories";
import { Separator } from "../ui/separator";
import { FaArrowRight } from "react-icons/fa6";
import { UpdateIcon } from "@/actions/admin/upload-icon";
import { compressIcon } from "@/lib/compress-image";

export default function CategoryForm() {
  const {
    currentCategory,
    setCurrentCategory,
    setAllCategories,
    allCategories,
    setLoading,
    loading,
    setCurrentContent,
  } = FindAdminContext();
  const [currentFileIcon, setCurrentFileIcon] = useState<File | null>(null);
  const [currentIcon, setCurrentIcon] = useState<string>(
    currentCategory?.icon || ""
  );
  const [labelCategory, setLabelCategory] = useState("");

  const [isPending, startTransition] = useTransition();

  const updateCategory = () => {
    setLoading(true);

    startTransition(() => {
      // Upload la nouvelle icone
      if (currentCategory) {
        if (currentFileIcon) {
          compressIcon(currentFileIcon as File).then((data) => {
            if (data) {
              const formDataIcon = new FormData();
              formDataIcon.append("file", data);
              UpdateIcon(formDataIcon, currentCategory.id).then((dataImage) => {
                if (dataImage.success) {
                  UpdatedCategory(
                    currentCategory.id,
                    labelCategory || currentCategory.name,
                    dataImage.url
                  ).then((data) => {
                    if (data.success) {
                      toast({
                        title: "Catégorie mise a jour",
                        description: "La catégorie a bien été mise a jour",
                        variant: "default",
                      });
                      setLoading(false);
                      setCurrentCategory(null);
                      setCurrentFileIcon(null);
                      setLabelCategory("");
                      setCurrentContent("categories");
                      if (allCategories) {
                        const newCategories = allCategories.map((category) => {
                          if (category.id === data.categoryUpdate.id) {
                            return data.categoryUpdate;
                          }
                          return category;
                        });
                        setAllCategories(newCategories);
                      }
                    }
                  });
                } else {
                  toast({
                    title: "Une erreur est survenue",
                    description: dataImage.error,
                    variant: "destructive",
                  });
                }
              });
            }
          });
        } else {
          if (currentCategory) {
            UpdatedCategory(
              currentCategory.id,
              labelCategory || currentCategory.name,
              currentCategory.icon || ""
            ).then((data) => {
              if (data.success) {
                toast({
                  title: "Catégorie mise a jour",
                  description: "La catégorie a bien été mise a jour",
                  variant: "default",
                });
                setLoading(false);
                setCurrentCategory(null);
                setCurrentFileIcon(null);
                setLabelCategory("");
                setCurrentContent("categories");
                if (allCategories) {
                  const newCategories = allCategories.map((category) => {
                    if (category.id === data.categoryUpdate.id) {
                      return data.categoryUpdate;
                    }
                    return category;
                  });
                  setAllCategories(newCategories);
                }
              }
            });
          }
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <Label className="font-bold">Nom de la catégorie</Label>
        <Input
          disabled={loading}
          placeholder={currentCategory?.name ?? "Nom de la catégorie"}
          type="text"
          onChange={(e) => setLabelCategory(e.target.value)}
        />
        <Separator />
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="name"
            className="text-left w-full flex flex-row justify-between items-center font-bold">
            Choisire une nouvelle icone pour la catégorie
            <span className="text-sm text-muted-foreground">(2Mo maximum)</span>
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
            L&#39;icône sera redimensionnée à 42x42.
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="name"
            className="text-left font-bold">
            prévisualisation de la catégorie mise à jour
          </Label>
          <div className="flex flex-row items-center gap-4 p-2">
            <div className="flex flex-row items-center gap-4 p-2 bg-gray-100 w-fit">
              <Image
                alt="preview"
                width={42}
                height={42}
                className="w-[42px] h-[42px]"
                src={currentCategory?.icon || "/images/other.png"}
              />
              <span>{currentCategory?.name || "exemple"}</span>
            </div>
            <FaArrowRight />
            <div className="flex flex-row items-center gap-4 p-2 bg-gray-100 w-fit">
              <Image
                alt="preview"
                width={42}
                height={42}
                className="w-[42px] h-[42px]"
                src={currentIcon || "/images/other.png"}
              />
              <span>{labelCategory || "exemple"}</span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          disabled={loading}
          onClick={updateCategory}>
          <div>
            <span>Modifier la Catégorie</span>
          </div>
        </Button>
      </div>
    </>
  );
}
