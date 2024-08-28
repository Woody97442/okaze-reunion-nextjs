"use client";

import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";
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
import { useState, useTransition } from "react";
import { CreateMessagePost } from "@/actions/message";
import FindUserContext from "@/lib/user-context-provider";
import { User } from "@/prisma/user/types";
import { toast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";

export const SendMessageButton = ({ id }: { id: string }) => {
  const { currentUser, setCurrentUser } = FindUserContext();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [conterPost, setConterPost] = useState<number>(0);

  const handleClickMessage = () => {
    const formDataMessage = new FormData();

    formDataMessage.append("message", message);
    formDataMessage.append("offer", offer);
    formDataMessage.append("postId", id);

    startTransition(() => {
      // Creation d'un post
      CreateMessagePost(formDataMessage).then((data) => {
        if (data?.success) {
          const currentUserMessages = currentUser?.messages;
          const newMessage = data?.newMessage;
          const updateUser = {
            ...currentUser,
            messages: [...(currentUserMessages ?? []), newMessage],
          };
          setCurrentUser(updateUser as User);
          toast({
            title: "Succès",
            description: data?.success,
          });
          setConterPost(conterPost + 1);
          setOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setConterPost(conterPost + 1);
          setOpen(false);
        }
      });
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}>
        <DialogTrigger disabled={currentUser ? false : true}>
          <div className="w-full gap-4 bg-secondary text-white flex items-center justify-center py-2 px-4 rounded-md hover:bg-secondary/80">
            <FiSend className="w-[20px] h-[20px] " />
            Message
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Envoyer un message</DialogTitle>
            <DialogDescription>
              Faire une offre ou envoyer un message
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label
                htmlFor="name"
                className="text-left">
                Mon offre
              </Label>
              <Input
                className="col-span-3"
                placeholder="10 €"
                onChange={(e) => setOffer(e.target.value)}
                disabled={isPending}
                type="number"
                accept="number"
              />
            </div>
            <div>
              <Label
                htmlFor="name"
                className="text-left">
                Message
              </Label>
              <Textarea
                placeholder="Je voudrait faire une offre..."
                onChange={(e) => setMessage(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <Button
            onClick={handleClickMessage}
            disabled={isPending || conterPost > 0}>
            Envoyer
          </Button>
        </DialogContent>
      </Dialog>
      {!currentUser && (
        <p className="text-xs text-red-400 text-center">
          Vous devez étre connecté pour envoyer un message
        </p>
      )}
    </>
  );
};
