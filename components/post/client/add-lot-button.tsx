"use client";

import React, { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BsBoxSeam } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { addToLot, createLot } from "@/actions/lot";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lot } from "@prisma/client";

export const AddLotButton = ({
  postId,
  lots,
}: {
  postId: string;
  lots: Lot[];
}) => {
  const [titleLot, setTitleLot] = useState("");
  const [selectedLot, setSelectedLot] = useState("");
  const [open, setOpen] = useState(false);

  const user = useCurrentUser();

  const CreatLot = () => {
    if (user) {
      startTransition(() => {
        createLot(titleLot, postId).then((data) => {
          if (data) {
            if (data?.success) {
              toast({
                title: "Succès",
                description: data?.success,
              });
              setOpen(false);
              window.location.reload();
            }

            if (data?.error) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
              setOpen(false);
            }
          }
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez vous connecter pour ajouter aux favoris",
      });
      setOpen(false);
    }
  };

  const AddLot = () => {
    if (user) {
      startTransition(() => {
        addToLot(selectedLot, postId).then((data) => {
          if (data) {
            if (data?.success) {
              toast({
                title: "Succès",
                description: data?.success,
              });
              setOpen(false);
            }

            if (data?.error) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
              setOpen(false);
            }
          }
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez vous connecter pour ajouter aux favoris",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger>
        <BsBoxSeam
          className="w-6 h-6 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un lot</DialogTitle>
          <DialogDescription>
            Voulez-vous créer un nouveau lot avec ce produit ?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right">
              Titre du lot
            </Label>
            <Input
              className="col-span-3"
              onChange={(e) => setTitleLot(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={CreatLot}>Créer</Button>
        <Separator />
        <DialogHeader>
          <DialogTitle>Ajouter à un lot</DialogTitle>
          <DialogDescription>Ajouter un lot à ce produit ?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={(value) => setSelectedLot(value)}
            defaultValue={"default"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {lots
                  ? lots.map((lot) => (
                      <SelectItem
                        key={lot.id}
                        value={lot.id}>
                        {lot.name}
                      </SelectItem>
                    ))
                  : null}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={AddLot}>Ajouter</Button>
      </DialogContent>
    </Dialog>
  );
};
