"use client";
import FindAdminContext from "@/lib/admin-context-provider";
import React, { useState, useTransition } from "react";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DeleteCategory } from "@/actions/admin/categories";
import { Category } from "@/prisma/category/types";
import { FaTrashAlt } from "react-icons/fa";
import LoaderOkaze from "../utils/loader";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const {
    setCurrentContent,
    setAllCategories,
    allCategories,
    setLoading,
    currentCategory,
    setCurrentCategory,
  } = FindAdminContext();
  const handleDeleteCategory = () => {
    setLoading(true);
    setCurrentCategory(null);
    setOpenModal(false);
    startTransition(() => {
      DeleteCategory(categoryId).then((data) => {
        if (data?.success) {
          toast({
            title: "Succès",
            description: data?.success,
          });
          if (currentCategory && currentCategory.id === categoryId) {
            setCurrentCategory(null);
            setCurrentContent("categories");
          }
          setLoading(false);
          if (allCategories) {
            const newCategories = allCategories.filter(
              (category) => category.id !== categoryId
            );
            setAllCategories(newCategories as Category[]);
          } else {
            setAllCategories([]);
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
      <Dialog
        open={openModal}
        onOpenChange={setOpenModal}>
        <DialogTrigger className="flex justify-start">
          <div className="flex justify-center w-auto btn items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2">
            <FaTrashAlt />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-center flex flex-col gap-4">
              <h3 className="text-xl font-bold">
                Voulez-vous vraiment supprimer cette catégorie ?
              </h3>
              <span>
                Toute les annonces de cette catégorie seront supprimés.
              </span>
            </DialogTitle>
            <Button
              variant={"destructive"}
              className="flex justify-center w-auto"
              disabled={isPending}
              onClick={handleDeleteCategory}>
              Confirmer la suppression
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {isPending && (
        <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0 overflow-hidden">
          <LoaderOkaze variant="light" />
        </div>
      )}
    </>
  );
}
