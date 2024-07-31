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

export default function CreateAttributsForm() {
  const {
    allAttributes,
    setAllAttributes,
    currentAttributsForPost,
    setCurrentAttributsForPost,
  } = FindAdminContext();

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
            setCurrentAttributsForPost([
              ...currentAttributsForPost,
              data.attribut,
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
  );
}
