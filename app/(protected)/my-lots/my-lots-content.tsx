"use client";

import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Lot } from "@/prisma/lot/types";
import React, { useState, useTransition } from "react";
import { deleteLot, deletePostInLot } from "@/actions/lot";
import { toast } from "@/components/ui/use-toast";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BsSend } from "react-icons/bs";
import Link from "next/link";
import { SendOfferSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormatPrice } from "@/lib/format-price";
import { TotalPriceLot } from "@/lib/total-price-lot";
import { FormatText } from "@/lib/format-text";
import FindUserContext from "@/lib/user-context-provider";
import { CreateMessage } from "@/actions/send-message";
import { User } from "@/prisma/user/types";

const MyLotsContent = () => {
  const { currentUser, setCurrentUser } = FindUserContext();

  const [currentLot, setCurrentLot] = useState<Lot>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [conterPost, setConterPost] = useState<number>(0);

  const handleChooseLot = (lot: Lot) => {
    setCurrentLot(lot);
  };

  const handleDeleteLot = (lot: Lot) => {
    const id = lot.id;
    startTransition(() => {
      deleteLot(id).then((data) => {
        if (data) {
          if (data?.success) {
            toast({
              title: "Succès",
              description: data?.success,
            });
            if (currentLot && id === currentLot?.id) {
              setCurrentLot(undefined);
            }
            const currentListLots = currentUser?.lot;

            if (currentListLots) {
              setCurrentUser({
                ...currentUser,
                lot: currentListLots.filter((lot) => lot.id !== id),
              });
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
  };

  const handleDeletePostInLot = (potsId: string, lot: Lot) => {
    const idLot = lot.id;
    startTransition(() => {
      deletePostInLot(potsId, idLot).then((data) => {
        if (data) {
          if (data?.success) {
            toast({
              title: "Succès",
              description: data?.success,
            });
            const currentListLots = currentUser?.lot;

            if (data.delete) {
              if (currentListLots) {
                setCurrentUser({
                  ...currentUser,
                  lot: currentListLots.filter((lot) => lot.id !== idLot),
                });
              }
              setCurrentLot(undefined);
            }

            const lotUpdated = data.lot;
            if (lotUpdated) {
              if (currentListLots) {
                setCurrentUser({
                  ...currentUser,
                  lot: currentListLots.map((lot) => {
                    if (lot.id === lotUpdated.id) {
                      return lotUpdated;
                    }
                    return lot;
                  }),
                });
              }

              if (currentLot && idLot === currentLot?.id) {
                setCurrentLot(lotUpdated);
              }
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(currentSearch);
    }
  };

  const form = useForm<z.infer<typeof SendOfferSchema>>({
    resolver: zodResolver(SendOfferSchema),
    defaultValues: {
      offer: 0,
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SendOfferSchema>) => {
    const formDataMessage = new FormData();

    formDataMessage.append("message", values.message);
    formDataMessage.append("offer", values.offer.toString());
    formDataMessage.append("lotId", currentLot?.id.toString() ?? "");

    startTransition(() => {
      // Creation d'un post
      CreateMessage(formDataMessage).then((data) => {
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
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setConterPost(conterPost + 1);
        }
      });
    });
  };

  return (
    <>
      <div className="flex flex-row space-x-6 h-full w-full">
        <aside className="flex flex-col gap-y-4 bg-white w-1/2 py-4 px-8 shadow-md rounded-sm">
          <div className="space-y-4 my-2">
            <h2 className="text-2xl text-black drop-shadow-md">Mes Lots</h2>
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
                {currentUser?.lot
                  .filter((lot) =>
                    lot.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((lot) => (
                    <div
                      className="flex flex-row space-x-4 items-center"
                      key={lot.id}>
                      <Button
                        variant={"outline"}
                        className="w-full h-auto justify-start space-x-4 "
                        onClick={() => handleChooseLot(lot)}
                        disabled={isPending}
                        asChild>
                        <div className="cursor-pointer">
                          {lot.posts[0].images.length > 0 ? (
                            <Avatar className="h-[55px] w-[55px]">
                              <AvatarImage src={lot.posts[0].images[0].src} />
                            </Avatar>
                          ) : (
                            <Avatar className="h-[55px] w-[55px]">
                              <AvatarImage
                                src={"/images/image_not_found_2.jpg"}
                              />
                            </Avatar>
                          )}
                          <span>{lot.name}</span>
                        </div>
                      </Button>
                      <Button
                        variant={"ghost"}
                        disabled={isPending}
                        className="hover:bg-white p-0 hover:scale-110 transition-all"
                        onClick={() => handleDeleteLot(lot)}>
                        <FiTrash2 className="w-[24px] h-[24px] cursor-pointer" />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          {currentLot ? (
            <div className="space-y-4 my-2">
              <h2 className="text-2xl text-black drop-shadow-md">
                Lot {FormatText(currentLot.name)}
              </h2>
              <Separator />
              <ScrollArea className="w-[800px]  whitespace-nowrap">
                <div className="flex space-x-4 w-max p-4 pb-6">
                  {currentLot.posts.map(
                    (post) =>
                      post && (
                        <Card
                          key={post.id}
                          className="relative transition-transform duration-300 ease-in-out transform hover:scale-105">
                          <Link href={`/posts/${post.id}`}>
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
                          <Button
                            variant={"ghost"}
                            disabled={isPending}
                            onClick={() =>
                              handleDeletePostInLot(post.id, currentLot)
                            }
                            className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                            <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-white" />
                          </Button>
                          <span className="absolute bottom-0 right-0 w-full p-2 rounded-b-md bg-[#01010165] shadow-[0_0_10px_0_rgba(0,0,5,0.5)]">
                            <div className="font-bold text-white text-center">
                              prix : {FormatPrice(post.price)} €
                            </div>
                          </span>
                        </Card>
                      )
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Separator />
              <div>
                <h2 className="text-2xl text-black drop-shadow-md">
                  Prix du lots : {FormatPrice(TotalPriceLot(currentLot))} €
                </h2>
              </div>
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={"offer"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mon offre</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="10 €"
                                type="number"
                                accept="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"message"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Je voudrait faire une offre..."
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending || conterPost > 1}>
                      <div className="w-full flex justify-center gap-x-2 items-center">
                        Faire une offre
                        <BsSend className="w-4 h-4" />
                      </div>
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            <h2 className="text-2xl text-black drop-shadow-md">Aucun lot</h2>
          )}
        </section>
      </div>
    </>
  );
};

export default MyLotsContent;
