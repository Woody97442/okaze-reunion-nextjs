"use client";

import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSearch, FiSend, FiTrash2 } from "react-icons/fi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useTransition } from "react";

import FindUserContext from "@/lib/user-context-provider";
import { Message } from "@/prisma/message/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import MessageBlock from "@/components/message/message-block";
import { BsSend } from "react-icons/bs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SendMessageSchema } from "@/schemas";
import { ArchivedMessage, SendNewMessage } from "@/actions/message";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const MessageContent = () => {
  const { currentUser, setCurrentUser } = FindUserContext();

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  const handleChooseMessage = (message: Message) => {
    setCurrentMessage(message);
  };

  const handleDeleteMessage = (message: Message) => {
    const id = message.id;
    startTransition(() => {
      ArchivedMessage(id).then((data) => {
        if (data) {
          if (data?.success) {
            toast({
              title: "Succès",
              description: data?.success,
            });
            setModalOpen(false);
            const listMessages = currentUser?.messages;
            if (listMessages) {
              setCurrentUser({
                ...currentUser,
                messages: listMessages.filter((message) => message.id !== id),
              });
            }
            if (currentMessage?.id === id) {
              setCurrentMessage(undefined);
            }
          }
          if (data?.error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: data?.error,
            });
            setModalOpen(false);
          }
        }
      });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(currentSearch);
    }
  };

  const form = useForm<z.infer<typeof SendMessageSchema>>({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SendMessageSchema>) => {
    const formDataMessage = new FormData();

    formDataMessage.append("message", values.message);
    formDataMessage.append("currentMessageId", currentMessage?.id ?? "");

    startTransition(() => {
      SendNewMessage(formDataMessage).then((data) => {
        if (data?.success) {
          const messageUpdate = data?.newContentMessage;
          setCurrentMessage(messageUpdate as unknown as Message);

          toast({
            title: "Succès",
            description: data?.success,
          });

          form.reset();
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
        }
      });
    });
  };

  console.log(currentUser);

  return (
    <div className="flex flex-row space-x-6 h-full w-full">
      <aside className="flex flex-col gap-y-4 bg-white w-1/2 py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">
          <h2 className="text-2xl text-black drop-shadow-md">Mes Messages</h2>
        </div>
        <div className="space-y-4 my-2">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={currentSearch}
              onChange={(e) => {
                setCurrentSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="submit"
              variant={"default"}
              onClick={() => setSearchTerm(currentSearch)}>
              <FiSearch className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="h-full justify-between flex flex-col">
          <ScrollArea className="h-[650px] w-full">
            <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
              {currentUser?.messages
                .filter(
                  (message) =>
                    message.lot &&
                    message.lot.name &&
                    !message.isArchived &&
                    message.lot.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((message) => {
                  // Vérifiez si message.lot et message.lot.posts sont définis et non vides
                  const lotHasPosts =
                    message.lot?.posts && message.lot.posts.length > 0;
                  return message.lot ? (
                    <div
                      className="flex flex-row space-x-4 items-center relative"
                      key={message.id}>
                      <Button
                        variant={"outline"}
                        className="w-full h-auto justify-start space-x-4"
                        onClick={() => handleChooseMessage(message)}
                        disabled={isPending}
                        asChild>
                        <div className="cursor-pointer">
                          {lotHasPosts ? (
                            <Avatar className="h-[55px] w-[55px]">
                              <AvatarImage
                                src={
                                  message.lot.posts[0].images[0]?.src ||
                                  "/images/image_not_found_2.jpg"
                                }
                              />
                            </Avatar>
                          ) : (
                            <Avatar className="h-[55px] w-[55px]">
                              <AvatarImage
                                src={"/images/image_not_found_2.jpg"}
                              />
                            </Avatar>
                          )}
                          {message.lot ? (
                            <div className="flex flex-col">
                              <span className="text-lg font-bold">
                                Titre du lot :{" "}
                              </span>
                              <span>{message.lot.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-lg font-bold">
                                Titre de l'annonce :{" "}
                              </span>
                              <span>ici titre de l'annonce</span>
                            </div>
                          )}
                        </div>
                      </Button>
                      <Dialog
                        open={modalOpen}
                        onOpenChange={setModalOpen}>
                        <DialogTrigger className="flex justify-start">
                          <FiTrash2 className="w-[24px] h-[24px] cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader className="space-y-4">
                            <DialogTitle className="text-center text-xl font-bold">
                              Supprimer le message
                            </DialogTitle>
                            <DialogDescription>
                              <strong className="text-lg text-center">
                                Le message sera archivé et vous ne pourrez plus
                                le voir
                              </strong>
                            </DialogDescription>
                            <Button
                              type="submit"
                              variant={"destructive"}
                              className="flex justify-center"
                              disabled={isPending}
                              onClick={() => handleDeleteMessage(message)}>
                              Confirmer
                            </Button>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      {message.lot ? (
                        <Badge
                          variant="secondary"
                          className="absolute left-0 bottom-0 text-white">
                          LOT
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="absolute left-0 bottom-0 text-white">
                          ANNONCE
                        </Badge>
                      )}
                    </div>
                  ) : null;
                })}
            </div>
          </ScrollArea>
        </div>
      </aside>
      <section className="flex flex-col justify-between bg-white w-full py-4 px-8 shadow-md rounded-sm">
        {currentMessage ? (
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h2 className="text-2xl text-black drop-shadow-md">
                Message : {currentMessage.lot?.name ?? ""}
              </h2>
              <Separator />
            </div>
            {/* Le contenue de la conversation */}
            <div className="h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
              {currentMessage.content.map((contentMessage) => (
                <div
                  key={contentMessage.id}
                  className="mx-5">
                  <MessageBlock messageUser={contentMessage} />
                </div>
              ))}
            </div>

            {/* Le formulair d'envoi de message */}
            <div>
              <Separator className="my-4" />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name={"message"}
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isPending}
                            placeholder="Message..."
                            className="min-h-12 resize-none border-1 p-5 shadow-md bg-gray-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="flex justify-end w-fit"
                      disabled={isPending}>
                      <div className="flex gap-x-2 items-center">
                        Envoyer
                        <BsSend className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <h2 className="text-2xl text-black drop-shadow-md">Aucun Message</h2>
        )}
      </section>
    </div>
  );
};

export default MessageContent;
