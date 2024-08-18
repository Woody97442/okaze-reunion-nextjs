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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SendMessageSchema } from "@/schemas";
import { SendNewMessage } from "@/actions/send-message";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/prisma/user/types";
const MessageContent = () => {
  const { currentUser, setCurrentUser } = FindUserContext();

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleChooseMessage = (message: Message) => {
    setCurrentMessage(message);
  };

  // const handleDeleteMessage = (lot: Lot) => {
  //   const id = message.lot.id;
  //   startTransition(() => {
  //     deleteLot(id).then((data) => {
  //       if (data) {
  //         if (data?.success) {
  //           toast({
  //             title: "Succès",
  //             description: data?.success,
  //           });
  //           if (currentLot && id === currentLot?.id) {
  //             setCurrentLot(undefined);
  //           }
  //           const currentListLots = currentUser?.lot;

  //           if (currentListLots) {
  //             setCurrentUser({
  //               ...currentUser,
  //               lot: currentListLots.filter((lot) => message.lot.id !== id),
  //             });
  //           }
  //         }
  //         if (data?.error) {
  //           toast({
  //             variant: "destructive",
  //             title: "Erreur",
  //             description: data?.error,
  //           });
  //         }
  //       }
  //     });
  //   });
  // };

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

  return (
    <>
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
                        className="flex flex-row space-x-4 items-center"
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
                            <span>{message.lot.name}</span>
                          </div>
                        </Button>
                        <Button
                          variant={"ghost"}
                          disabled={isPending}
                          className="hover:bg-white p-0 hover:scale-110 transition-all"
                          // onClick={() => handleDeleteMessage(message)}
                        >
                          <FiTrash2 className="w-[24px] h-[24px] cursor-pointer" />
                        </Button>
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
            <h2 className="text-2xl text-black drop-shadow-md">
              Aucun Message
            </h2>
          )}
        </section>
      </div>
    </>
  );
};

export default MessageContent;
