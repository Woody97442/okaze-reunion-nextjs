"use client";

import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useTransition } from "react";
import Image from "next/image";

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
import FindAdminContext from "@/lib/admin-context-provider";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FormatPrice } from "@/lib/format-price";
import { TotalPriceLot } from "@/lib/total-price-lot";
import {
  ArchivedMessageAdmin,
  SendNewMessageAdmin,
  SwitchReadMessageByAdmin,
} from "@/actions/admin/messages";
import { Checkbox } from "@/components/ui/checkbox";
import { FormatDateForMessage } from "@/lib/format-date";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HiMenuAlt2 } from "react-icons/hi";
const AdminMessageContent = () => {
  const { allMessages, setAllMessages } = FindAdminContext();

  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterIsRead, setFilterIsRead] = useState<boolean>(true);
  const [filterIsNotRead, setFilterIsNotRead] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChooseMessage = (message: Message) => {
    setCurrentMessage(message);
    setMenuOpen(false);
    if (!message.isReadByAdmin) {
      const currentMessageId = message.id;
      startTransition(() => {
        SwitchReadMessageByAdmin(currentMessageId).then((data) => {
          if (data) {
            if (data?.success) {
              const listMessages = allMessages;
              const updateMessage = data.updateReadMessage;
              if (listMessages) {
                // Mise à jour de l'état du message
                const updatedMessages = listMessages.map((message) =>
                  message.id === updateMessage.id ? updateMessage : message
                );
                setAllMessages(updatedMessages as Message[]);
              }
            }
            if (data?.error) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
            }
          }
        });
      });
    }
  };

  const handleDeleteMessage = (message: Message) => {
    const id = message.id;
    startTransition(() => {
      ArchivedMessageAdmin(id).then((data) => {
        if (data) {
          if (data?.success) {
            toast({
              title: "Succès",
              description: data?.success,
            });
            setModalOpen(false);
            const listMessages = allMessages;
            const updateMessage = data.messageArchived;
            if (listMessages) {
              // Mise à jour de l&#39;état du message
              const updatedMessages = listMessages.map((message) =>
                message.id === updateMessage.id ? updateMessage : message
              );
              setAllMessages(updatedMessages as Message[]);
              console.log(updatedMessages);
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
      SendNewMessageAdmin(formDataMessage).then((data) => {
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
    <div className="flex flex-col md:flex-row md:space-x-6 h-full w-full">
      <aside className="hidden md:flex flex-col gap-y-4 bg-white w-1/2 py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">
          <h2 className="text-2xl text-black font-lato font-bold">
            Mes Messages
          </h2>
        </div>
        <div className="space-y-4 my-2">
          <div className="flex flex-col space-y-4">
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
            <Separator />
            <h3 className="text-lg font-bold">Filtre :</h3>
            <div className="flex flex-col space-y-4">
              <div className="items-top flex space-x-2 justify-between items-center">
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="new"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Messages Lus
                  </label>
                </div>
                <Checkbox
                  id="read"
                  className="h-6 w-6 "
                  checked={filterIsRead}
                  onClick={() => setFilterIsRead(!filterIsRead)}
                />
              </div>
              <div className="items-top flex space-x-2 justify-between items-center">
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="new"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Messages Non Lus
                  </label>
                </div>
                <Checkbox
                  id="notRead"
                  className="h-6 w-6 "
                  checked={filterIsNotRead}
                  onClick={() => setFilterIsNotRead(!filterIsNotRead)}
                />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="h-full justify-between flex flex-col">
          <ScrollArea className="h-[400px] w-full">
            <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
              {allMessages &&
                allMessages
                  .filter((message) => {
                    if (message.lot) {
                      const filter =
                        message.lot &&
                        message.lot.name &&
                        !message.isArchived &&
                        message.lot.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      if (filterIsRead && message.isReadByAdmin) {
                        return filter;
                      }
                      if (filterIsNotRead && !message.isReadByAdmin) {
                        return filter;
                      }
                    } else {
                      const filter =
                        message.post &&
                        message.post.title &&
                        !message.isArchived &&
                        message.post.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      if (filterIsRead && message.isReadByAdmin) {
                        return filter;
                      }
                      if (filterIsNotRead && !message.isReadByAdmin) {
                        return filter;
                      }
                    }
                    return;
                  })
                  .sort((a, b) => {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
                  .map((message) => {
                    // Vérifiez si message.lot et message.lot.posts sont définis et non vides
                    const lotHasPosts =
                      message.lot?.posts && message.lot.posts.length > 0;
                    return message.lot ? (
                      <div
                        className="flex flex-row space-x-4 items-center relative "
                        key={message.id}>
                        <Button
                          variant={"outline"}
                          className={
                            !message.isReadByAdmin
                              ? " w-full h-auto justify-start space-x-9 bg-gray-200 shadow-md"
                              : " w-full h-auto justify-start space-x-9 bg-white"
                          }
                          onClick={() => handleChooseMessage(message)}
                          disabled={isPending}
                          asChild>
                          <div className="cursor-pointer">
                            {lotHasPosts && (
                              <Avatar className="h-[55px] w-[55px]">
                                <AvatarImage
                                  src={
                                    message.lot.posts[0].images[0]?.src ||
                                    "/images/image_not_found_2.jpg"
                                  }
                                />
                              </Avatar>
                            )}
                            <div>
                              <div className="flex flex-row space-x-2">
                                <span className="text-sm font-bold">
                                  {message.lot.name}
                                </span>
                              </div>

                              <div>
                                <span className="text-sm font-bold">
                                  Auteur :{" "}
                                </span>
                                <span>
                                  {message.user?.name ||
                                    message.user?.username ||
                                    message.user?.email}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-bold">
                                  Date :{" "}
                                </span>
                                <span>
                                  {FormatDateForMessage(message.createdAt)}
                                </span>
                              </div>
                            </div>
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
                                  Le message sera archivé
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
                        <Badge
                          variant="secondary"
                          className="absolute left-0 bottom-0 text-white">
                          LOT
                        </Badge>
                      </div>
                    ) : (
                      <div
                        className="flex flex-row space-x-4 items-center relative"
                        key={message.id}>
                        <Button
                          variant={"outline"}
                          className={
                            !message.isReadByAdmin
                              ? " w-full h-auto justify-start space-x-9 bg-gray-200 shadow-md"
                              : " w-full h-auto justify-start space-x-9 bg-white"
                          }
                          onClick={() => handleChooseMessage(message)}
                          disabled={isPending}
                          asChild>
                          <div className="cursor-pointer">
                            {message.post && message.post.images.length > 0 && (
                              <Avatar className="h-[55px] w-[55px]">
                                <AvatarImage
                                  src={
                                    message.post.images[0]?.src ||
                                    "/images/image_not_found_2.jpg"
                                  }
                                />
                              </Avatar>
                            )}
                            <div>
                              <div className="flex flex-row space-x-2">
                                <span className="text-sm font-bold">
                                  {message.post
                                    ? message.post.title
                                    : "Annonce"}
                                </span>
                              </div>

                              <div>
                                <span className="text-sm font-bold">
                                  Auteur :{" "}
                                </span>
                                <span>
                                  {message.user?.name ||
                                    message.user?.username ||
                                    message.user?.email}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-bold">
                                  Date :{" "}
                                </span>
                                <span>
                                  {FormatDateForMessage(message.createdAt)}
                                </span>
                              </div>
                            </div>
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
                                  Le message sera archivé et vous ne pourrez
                                  plus le voir
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
                        <Badge
                          variant="default"
                          className="absolute left-0 bottom-0 text-white">
                          ANNONCE
                        </Badge>
                      </div>
                    );
                  })}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="space-y-4 my-2">
          <h2 className="text-2xl text-black font-lato font-bold">
            Messages Archivés
          </h2>
        </div>
        <div className="h-full justify-between flex flex-col">
          <ScrollArea className="h-[400px] w-full">
            <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
              {allMessages &&
                allMessages
                  .filter((message) => message.isArchived)
                  .sort((a, b) => {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
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
                          className={
                            "w-full h-auto justify-start space-x-9 bg-gray-300 shadow-md"
                          }
                          onClick={() => handleChooseMessage(message)}
                          disabled={isPending}
                          asChild>
                          <div className="cursor-pointer">
                            {lotHasPosts ? (
                              <Avatar className="h-[45px] w-[45px]">
                                <AvatarImage
                                  src={
                                    message.lot.posts[0].images[0]?.src ||
                                    "/images/image_not_found_2.jpg"
                                  }
                                />
                              </Avatar>
                            ) : (
                              <Avatar className="h-[45px] w-[45px]">
                                <AvatarImage
                                  src={"/images/image_not_found_2.jpg"}
                                />
                              </Avatar>
                            )}
                            <div>
                              <div className="flex flex-row space-x-2">
                                <span className="text-sm font-bold">
                                  Titre du lot :{" "}
                                </span>
                                <span>{message.lot.name}</span>
                              </div>

                              <div>
                                <span className="text-sm font-bold">
                                  Auteur :{" "}
                                </span>
                                <span>
                                  {message.user?.name ||
                                    message.user?.username ||
                                    message.user?.email}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-bold">
                                  Date :{" "}
                                </span>
                                <span>
                                  {FormatDateForMessage(message.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Button>
                        <Badge
                          variant="secondary"
                          className="absolute left-0 bottom-0 text-white">
                          LOT
                        </Badge>
                      </div>
                    ) : (
                      <div
                        className="flex flex-row space-x-4 items-center relative"
                        key={message.id}>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full h-auto justify-start space-x-9 bg-gray-300 shadow-md"
                          }
                          onClick={() => handleChooseMessage(message)}
                          disabled={isPending}
                          asChild>
                          <div className="cursor-pointer">
                            {message.post && message.post.images.length > 0 && (
                              <Avatar className="h-[55px] w-[55px]">
                                <AvatarImage
                                  src={
                                    message.post.images[0]?.src ||
                                    "/images/image_not_found_2.jpg"
                                  }
                                />
                              </Avatar>
                            )}
                            <div>
                              <div className="flex flex-row space-x-2">
                                <span className="text-md font-bold">
                                  {message.post
                                    ? message.post.title
                                    : "Annonce"}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-bold">
                                  Auteur :{" "}
                                </span>
                                <span>
                                  {message.user?.name ||
                                    message.user?.username ||
                                    message.user?.email}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-bold">
                                  Date :{" "}
                                </span>
                                <span>
                                  {FormatDateForMessage(message.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Button>
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
                    );
                  })}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Menu sheet */}
      <div className="grid gap-2 md:hidden">
        <Sheet
          key="left"
          onOpenChange={setMenuOpen}
          open={menuOpen}>
          <SheetTrigger
            asChild
            className="mb-6 ">
            <div className="bg-secondary rounded-md p-2 w-full flex flex-row items-center justify-center text-white gap-4">
              <HiMenuAlt2 className="w-6 h-6 " />
              Sélectionnez un messages
            </div>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full overflow-y-scroll">
            <SheetHeader>
              <SheetTitle className="font-Lato mb-4">
                <div>
                  <span>Mes Messages</span>
                  <Separator />
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <div className="flex flex-col gap-y-6 items-center py-4 ">
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
              </div>
            </div>
            <Separator />
            <div className="p-4">
              <div className="flex flex-col gap-y-6 items-center py-4 ">
                <h3 className="text-lg font-bold">Filtre :</h3>
                <div className="flex flex-row space-x-4 justify-between items-center">
                  <div className="items-top flex space-x-2 justify-between items-center">
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="new"
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Lus
                      </label>
                    </div>
                    <Checkbox
                      id="read"
                      className="h-6 w-6 "
                      checked={filterIsRead}
                      onClick={() => setFilterIsRead(!filterIsRead)}
                    />
                  </div>
                  <div className="items-top flex space-x-4 justify-between items-center">
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="new"
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Non Lus
                      </label>
                    </div>
                    <Checkbox
                      id="notRead"
                      className="h-6 w-6 "
                      checked={filterIsNotRead}
                      onClick={() => setFilterIsNotRead(!filterIsNotRead)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <ScrollArea className="h-[400px] w-auto ">
              <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
                {allMessages &&
                  allMessages
                    .filter((message) => {
                      if (message.lot) {
                        const filter =
                          message.lot &&
                          message.lot.name &&
                          !message.isArchived &&
                          message.lot.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        if (filterIsRead && message.isReadByAdmin) {
                          return filter;
                        }
                        if (filterIsNotRead && !message.isReadByAdmin) {
                          return filter;
                        }
                      } else {
                        const filter =
                          message.post &&
                          message.post.title &&
                          !message.isArchived &&
                          message.post.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        if (filterIsRead && message.isReadByAdmin) {
                          return filter;
                        }
                        if (filterIsNotRead && !message.isReadByAdmin) {
                          return filter;
                        }
                      }
                      return;
                    })
                    .sort((a, b) => {
                      return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                      );
                    })
                    .map((message) => {
                      // Vérifiez si message.lot et message.lot.posts sont définis et non vides
                      const lotHasPosts =
                        message.lot?.posts && message.lot.posts.length > 0;
                      return message.lot ? (
                        <div
                          className="flex flex-row space-x-4 items-center relative "
                          key={message.id}>
                          <Button
                            variant={"outline"}
                            className={
                              !message.isReadByAdmin
                                ? " w-full h-auto justify-start space-x-9 bg-gray-200 shadow-md"
                                : " w-full h-auto justify-start space-x-9 bg-white"
                            }
                            onClick={() => handleChooseMessage(message)}
                            disabled={isPending}
                            asChild>
                            <div className="cursor-pointer">
                              {lotHasPosts && (
                                <Avatar className="h-[55px] w-[55px]">
                                  <AvatarImage
                                    src={
                                      message.lot.posts[0].images[0]?.src ||
                                      "/images/image_not_found_2.jpg"
                                    }
                                  />
                                </Avatar>
                              )}
                              <div>
                                <div className="flex flex-row space-x-2">
                                  <span className="text-sm font-bold">
                                    {message.lot.name}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-sm font-bold">
                                    Auteur :{" "}
                                  </span>
                                  <span>
                                    {message.user?.name ||
                                      message.user?.username ||
                                      message.user?.email}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm font-bold">
                                    Date :{" "}
                                  </span>
                                  <span>
                                    {FormatDateForMessage(message.createdAt)}
                                  </span>
                                </div>
                              </div>
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
                                    Le message sera archivé
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
                          <Badge
                            variant="secondary"
                            className="absolute left-0 bottom-0 text-white">
                            LOT
                          </Badge>
                        </div>
                      ) : (
                        <div
                          className="flex flex-row space-x-4 items-center relative "
                          key={message.id}>
                          <Button
                            variant={"outline"}
                            className={
                              !message.isReadByAdmin
                                ? " w-full h-auto justify-start space-x-9 bg-gray-200 shadow-md"
                                : " w-full h-auto justify-start space-x-9 bg-white"
                            }
                            onClick={() => handleChooseMessage(message)}
                            disabled={isPending}
                            asChild>
                            <div className="cursor-pointer">
                              {message.post &&
                                message.post.images.length > 0 && (
                                  <Avatar className="h-[45px] w-[45px]">
                                    <AvatarImage
                                      src={
                                        message.post.images[0]?.src ||
                                        "/images/image_not_found_2.jpg"
                                      }
                                    />
                                  </Avatar>
                                )}
                              <div>
                                <div className="flex flex-row space-x-2">
                                  <span className="text-sm font-bold text-wrap">
                                    {message.post
                                      ? message.post.title
                                      : "Annonce"}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-sm font-bold text-wrap">
                                    Auteur :{" "}
                                  </span>
                                  <span>
                                    {message.user?.name ||
                                      message.user?.username ||
                                      message.user?.email}
                                  </span>
                                </div>
                                <div>
                                  <span>
                                    {FormatDateForMessage(message.createdAt)}
                                  </span>
                                </div>
                              </div>
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
                                    Le message sera archivé et vous ne pourrez
                                    plus le voir
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
                          <Badge
                            variant="default"
                            className="absolute left-0 bottom-0 text-white">
                            <span className="text-[10px]">ANNONCE</span>
                          </Badge>
                        </div>
                      );
                    })}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <Separator />
            <div className="space-y-4 my-2">
              <h2 className="text-2xl text-black font-lato font-bold">
                Messages Archivés
              </h2>
            </div>
            <div className="h-full justify-between flex flex-col">
              <ScrollArea className="h-[400px] w-full">
                <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
                  {allMessages &&
                    allMessages
                      .filter((message) => message.isArchived)
                      .sort((a, b) => {
                        return (
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                        );
                      })
                      .map((message) => {
                        // Vérifiez si message.lot et message.lot.posts sont définis et non vides
                        const lotHasPosts =
                          message.lot?.posts && message.lot.posts.length > 0;
                        return message.lot ? (
                          <div
                            className="flex flex-row space-x-4 items-center relative "
                            key={message.id}>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full h-auto justify-start space-x-9 bg-gray-300 shadow-md"
                              }
                              onClick={() => handleChooseMessage(message)}
                              disabled={isPending}
                              asChild>
                              <div className="cursor-pointer">
                                {lotHasPosts ? (
                                  <Avatar className="h-[45px] w-[45px]">
                                    <AvatarImage
                                      src={
                                        message.lot.posts[0].images[0]?.src ||
                                        "/images/image_not_found_2.jpg"
                                      }
                                    />
                                  </Avatar>
                                ) : (
                                  <Avatar className="h-[45px] w-[45px]">
                                    <AvatarImage
                                      src={"/images/image_not_found_2.jpg"}
                                    />
                                  </Avatar>
                                )}
                                <div>
                                  <div className="flex flex-row space-x-2">
                                    <span className="text-sm font-bold">
                                      Titre du lot :{" "}
                                    </span>
                                    <span>{message.lot.name}</span>
                                  </div>

                                  <div>
                                    <span className="text-sm font-bold">
                                      Auteur :{" "}
                                    </span>
                                    <span>
                                      {message.user?.name ||
                                        message.user?.username ||
                                        message.user?.email}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold">
                                      Date :{" "}
                                    </span>
                                    <span>
                                      {FormatDateForMessage(message.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Button>
                            <Badge
                              variant="secondary"
                              className="absolute left-0 bottom-0 text-white">
                              LOT
                            </Badge>
                          </div>
                        ) : (
                          <div
                            className="flex flex-row space-x-4 items-center relative "
                            key={message.id}>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full h-auto justify-start space-x-9 bg-gray-300 shadow-md"
                              }
                              onClick={() => handleChooseMessage(message)}
                              disabled={isPending}
                              asChild>
                              <div className="cursor-pointer">
                                {message.post &&
                                  message.post.images.length > 0 && (
                                    <Avatar className="h-[55px] w-[55px]">
                                      <AvatarImage
                                        src={
                                          message.post.images[0]?.src ||
                                          "/images/image_not_found_2.jpg"
                                        }
                                      />
                                    </Avatar>
                                  )}
                                <div>
                                  <div className="flex flex-row space-x-2">
                                    <span className="text-md font-bold">
                                      {message.post
                                        ? message.post.title
                                        : "Annonce"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold">
                                      Auteur :{" "}
                                    </span>
                                    <span>
                                      {message.user?.name ||
                                        message.user?.username ||
                                        message.user?.email}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold">
                                      Date :{" "}
                                    </span>
                                    <span>
                                      {FormatDateForMessage(message.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Button>
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
                        );
                      })}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <section className="flex flex-col justify-between bg-white w-full py-4 px-8 shadow-md rounded-sm">
        {currentMessage ? (
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 items-start md:items-center gap-4">
                <h2 className="text-xl md:text-2xl text-black font-lato font-bold ">
                  {currentMessage.lot ? "Message :" : "Message de l'annonce :"}
                </h2>
                <span className="text-lg md:text-xl !m-0">
                  {currentMessage.lot
                    ? currentMessage.lot.name
                    : currentMessage.post?.title}
                </span>
              </div>
              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col space-y-4 md:space-y-0">
                  <span className="text-lg font-semibold">
                    {currentMessage.lot
                      ? "Prix du lots de base : "
                      : "Prix de l'annonce : "}
                  </span>
                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-secondary text-primary-foreground shadow h-8 px-4 py-2">
                    {currentMessage.lot
                      ? `${
                          currentMessage.lot &&
                          FormatPrice(TotalPriceLot(currentMessage.lot))
                        }€`
                      : `${
                          currentMessage.post &&
                          FormatPrice(currentMessage.post.price)
                        }€`}
                  </span>
                </div>
                <div className="flex flex-col space-y-4 md:space-y-0">
                  <span className="text-lg font-semibold">
                    {currentMessage.lot
                      ? "Offre pour le lots : "
                      : "Offre pour l'annonce : "}
                  </span>
                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-primary text-primary-foreground shadow h-8 px-4 py-2">
                    {currentMessage.content &&
                      currentMessage.content[0].offerPrice}
                    €
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <span className="text-lg font-semibold">
                  {currentMessage.lot
                    ? "Annonces dans le lot"
                    : "Image de l'annonce"}
                </span>
                {currentMessage.post && (
                  <Link
                    href={`/post/${currentMessage.post.id}`}
                    className="bg-secondary text-white rounded-md px-4 py-2 font-semibold hover:bg-secondary/80">
                    Voir l&#39;annonce
                  </Link>
                )}
              </div>
              <ScrollArea className="w-full md:w-[800px] whitespace-nowrap">
                {currentMessage.lot ? (
                  <div className="flex space-x-4 w-max p-4 pb-6">
                    {currentMessage.lot &&
                      currentMessage.lot.posts.map(
                        (post) =>
                          post && (
                            <Card
                              key={post.id}
                              className="relative transition-transform duration-300 ease-in-out transform hover:scale-105">
                              <Link href={`/post/${post.id}`}>
                                {post.images[0] ? (
                                  <Image
                                    alt={post.images[0].alt}
                                    className="rounded-md w-40 h-40 object-cover "
                                    width="160"
                                    height="160"
                                    src={post.images[0].src}
                                  />
                                ) : (
                                  <Image
                                    alt="image not found"
                                    className="rounded-md w-40 h-40 object-cover"
                                    width="160"
                                    height="160"
                                    src="/images/image_not_found.png"
                                  />
                                )}
                              </Link>
                              <span className="absolute bottom-0 right-0 w-full p-2 rounded-b-md bg-[#01010165] shadow-[0_0_10px_0_rgba(0,0,5,0.5)]">
                                <div className="font-bold text-white text-center">
                                  prix : {FormatPrice(post.price)} €
                                </div>
                              </span>
                            </Card>
                          )
                      )}
                  </div>
                ) : (
                  <div className="flex space-x-4 w-max p-4 pb-6">
                    {currentMessage.post &&
                      currentMessage.post.images.length > 0 &&
                      currentMessage.post.images.map(
                        (image, index) =>
                          image && (
                            <Dialog key={index}>
                              <DialogTrigger>
                                <Image
                                  key={image.id}
                                  alt={image.alt}
                                  width="160"
                                  height="160"
                                  className="rounded-md w-40 h-40 object-cover"
                                  src={image.src}
                                />
                              </DialogTrigger>
                              <DialogContent className="bg-transparent border-none p-0 text-white">
                                <DialogTitle className="text-lg md:text-xl text-white">
                                  {currentMessage.post
                                    ? currentMessage.post.title
                                    : ""}
                                </DialogTitle>
                                <Image
                                  key={index}
                                  alt={
                                    currentMessage.post
                                      ? currentMessage.post.title
                                      : ""
                                  }
                                  width="800"
                                  height="800"
                                  className=" rounded-md object-cover"
                                  src={
                                    image.src || "/images/image_not_found_2.jpg"
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                          )
                      )}
                  </div>
                )}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            {/* Le contenue de la conversation */}
            <div className="h-[400px] md:h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
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
          <h2 className="text-2xl text-black font-lato font-bold">
            Aucun Message
          </h2>
        )}
      </section>
    </div>
  );
};

export default AdminMessageContent;
