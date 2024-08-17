"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FindAdminContext from "@/lib/admin-context-provider";
import { toast } from "@/components/ui/use-toast";
import { Attribut } from "@/prisma/attribut/types";
import React, { useState, useTransition } from "react";
import { CreateAttribut } from "@/actions/admin/attributes";
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

export default function CreateAttributsForm() {
  const { allAttributes, setAllAttributes, currentPost, setCurrentPost } =
    FindAdminContext();

  const [labelNewAttributs, setLabelNewAttributs] = useState("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const CreateNewAttribut = () => {
    if (labelNewAttributs) {
      startTransition(() => {
        CreateAttribut(labelNewAttributs).then((data) => {
          if (data?.success) {
            setOpen(false);
            setLabelNewAttributs("");
            const newAttributes = [
              ...(allAttributes as Attribut[]),
              data.attribut,
            ];
            setAllAttributes(newAttributes);
            const addAttributs = [
              ...(currentPost?.attributs || []),
              data.attribut,
            ];
            const updateCurrentPost = {
              ...currentPost,
              attributs: addAttributs,
            };
            setCurrentPost(updateCurrentPost as Post);
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
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de l'attribut ne doit pas étre vide !",
      });
      setOpen(false);
    }
  };
  return (
    <>
      <div className="font-bold">Sélectionnez les attributs</div>
      <Select
        onValueChange={(field) => {
          const selectedAttributes = allAttributes?.find(
            (attributs) => attributs.id === field
          );
          if (selectedAttributes) {
            const addAttributs = [
              ...(currentPost?.attributs || []),
              selectedAttributes,
            ];
            const updateCurrentPost = {
              ...currentPost,
              attributs: addAttributs,
            };
            setCurrentPost(updateCurrentPost as Post);
          }
        }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={""} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {allAttributes?.map((attributs) => (
              <SelectItem
                key={attributs.id}
                value={attributs.id}>
                <div className="flex flex-row items-center gap-x-4">
                  {attributs.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex flex-row items-center justify-between font-bold">
        <div className="flex flex-row items-center gap-x-2">
          Attributs <FaArrowDown />
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger>
            <div className="text-white bg-secondary rounded-md px-3 py-2">
              Nouvelle attribut
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau attribut</DialogTitle>
            </DialogHeader>
            <div className="grid gap-8 py-4">
              <div className="flex flex-col gap-2">
                <div className="text-left">Nom du nouvel attribut</div>
                <Input
                  className="col-span-3"
                  onChange={(e) => {
                    setLabelNewAttributs(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button
              onClick={CreateNewAttribut}
              disabled={isPending}>
              Créer
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col space-y-3 border border-slate-300 rounded-md p-3 min-h-[100px]">
        {currentPost &&
          currentPost?.attributs &&
          currentPost?.attributs?.map((attribut) => (
            <div
              key={attribut.id}
              className="flex flex-row items-center gap-x-2">
              <FaXmark
                className="cursor-pointer h-4 w-4 text-red-500"
                onClick={() => {
                  const newAttributs = currentPost?.attributs?.filter(
                    (c) => c.id !== attribut.id
                  );
                  setCurrentPost({
                    ...currentPost,
                    attributs: newAttributs,
                  } as Post);
                }}
              />
              <div className=" font-bold">
                <div className="flex flex-row items-center gap-x-4">
                  {attribut.name}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
