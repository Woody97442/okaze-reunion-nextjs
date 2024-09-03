"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import CreateCategoryForm from "./create-category-form";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreatPostSchema } from "@/schemas";
import FindAdminContext from "@/lib/admin-context-provider";
import { Post } from "@/prisma/post/types";
import CreateAttributsForm from "./create-attributs-form";
import { CreatePost, UpdatePost } from "@/actions/admin/post";
import { UploadImage } from "@/actions/admin/upload-image";
import AlertDialogPost from "./alert-dialog-post";

export default function PostForm() {
  const {
    allPosts,
    setAllPosts,
    currentPost,
    setCurrentPost,
    setLoading,
    loading,
    tempUploadFiles,
    setTempUploadFiles,
  } = FindAdminContext();

  const [isPending, startTransition] = useTransition();
  const [openAlert, setOpenAlert] = useState(false);
  const [icode, setIcode] = useState("000");

  const form = useForm<z.infer<typeof CreatPostSchema>>({
    resolver: zodResolver(CreatPostSchema),
    defaultValues: {
      title: currentPost?.title ?? "",
      description: currentPost?.description ?? "",
      price: currentPost?.price ?? 0,
      state: currentPost?.state ?? "new",
      categories: [],
      attributes: [],
      images: [],
    },
  });

  const onSubmit = (values: z.infer<typeof CreatPostSchema>) => {
    setLoading(true);

    if (!currentPost?.categories || !currentPost?.categories.length) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez selectionner au moins une categorie",
      });
      setLoading(false);
      return;
    }

    let post = {
      ...currentPost,
      id: currentPost?.id || "",
      title: values.title,
      description: values.description,
      price: values.price,
      state: values.state,
    };

    startTransition(() => {
      if (!currentPost.id) {
        // Creation d'un post
        CreatePost(post as Post).then((data) => {
          if (data?.success) {
            if (tempUploadFiles.length > 0) {
              const formDataImage = new FormData();

              for (let i = 0; i < tempUploadFiles.length; i++) {
                formDataImage.append("images", tempUploadFiles[i].file);
              }

              // Upload image
              UploadImage(formDataImage, data.post as Post).then((data) => {
                if (data) {
                  if (data?.success) {
                    toast({
                      title: "Succès",
                      description: data?.success,
                    });
                    setIcode(data?.newPost?.icode as string);
                    form.reset();
                    setCurrentPost(null);
                    setTempUploadFiles([]);
                    setLoading(false);
                    setOpenAlert(true);
                    setAllPosts([...(allPosts || []), data?.newPost as Post]);
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Erreur",
                      description: data?.error,
                    });
                    setLoading(false);
                  }
                }
              });
            } else {
              toast({
                title: "Succès",
                description: data?.success,
              });
              setIcode(data?.post.icode as string);
              form.reset();
              setCurrentPost(null);
              setLoading(false);
              setTempUploadFiles([]);
              setOpenAlert(true);

              setAllPosts([...(allPosts || []), data?.post as Post]);
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
      } else {
        // Mise a jour d'un post
        UpdatePost(post as Post).then((dataUpdate) => {
          if (dataUpdate?.success) {
            if (tempUploadFiles.length > 0) {
              const formDataImage = new FormData();

              for (let i = 0; i < tempUploadFiles.length; i++) {
                formDataImage.append("images", tempUploadFiles[i].file);
              }

              // Upload les nouvelle images image
              UploadImage(formDataImage, dataUpdate.post as Post).then(
                (data) => {
                  if (data) {
                    if (data?.success) {
                      toast({
                        title: "Succès",
                        description: "Post mise a jour avec succes",
                      });
                      setIcode(data?.newPost?.icode as string);
                      setCurrentPost(data?.newPost as Post);
                      setTempUploadFiles([]);
                      setLoading(false);
                      // Mise a jour du post dans la liste
                      setAllPosts(
                        allPosts?.map((post) => {
                          if (post.id === data?.newPost?.id) {
                            return data?.newPost as Post;
                          }
                          return post;
                        }) || []
                      );
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: data?.error,
                      });
                      setLoading(false);
                    }
                  }
                }
              );
            } else {
              toast({
                title: "Succès",
                description: "Post mise a jour avec succes",
              });
              setIcode(dataUpdate?.post?.icode as string);
              setCurrentPost(dataUpdate?.post as Post);
              setTempUploadFiles([]);
              setLoading(false);
              // Mise a jour du post dans la liste
              setAllPosts(
                allPosts?.map((post) => {
                  if (post.id === dataUpdate?.post?.id) {
                    return dataUpdate?.post as Post;
                  }
                  return post;
                }) || []
              );
            }
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: dataUpdate?.error,
            });
            setLoading(false);
          }
        });
      }
    });
  };

  return (
    <>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name={"title"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Titre de l&#39;annonce
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder={currentPost?.title ?? "Mon Titre"}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Valeur de la description de l'annonce */}
              <FormField
                control={form.control}
                name={"description"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          currentPost?.description ?? "Mon annonce est..."
                        }
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row space-x-12">
              <div className="space-y-4 w-full">
                {/* Valeur du prix de l'annonce */}
                <FormField
                  control={form.control}
                  name={"price"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Prix en €</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder={currentPost?.price?.toString() ?? "25"}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Formulaire pour créer un nouvelle attribut*/}
                <CreateAttributsForm />
              </div>
              <div className="space-y-4 w-full">
                {/* Valeur de l'état de l'annonce */}
                <FormField
                  control={form.control}
                  name={"state"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Séléctionnez un état
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={currentPost?.state ?? "new"}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={""} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={"new"}>Neuf</SelectItem>
                              <SelectItem value={"very_good"}>
                                Très bon
                              </SelectItem>
                              <SelectItem value={"good"}>Bon</SelectItem>
                              <SelectItem value={"satisfactory"}>
                                Satisfaisant
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*Formulaire pour créer une nouvelle catégorie*/}
                <CreateCategoryForm />
              </div>
            </div>
            {currentPost && currentPost.id ? (
              <Button
                type="submit"
                disabled={loading}>
                <div>
                  <span>Modifier l&#39;annonce</span>
                </div>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}>
                <div className="w-full flex justify-start gap-x-2 items-center">
                  <span>Créer une nouvelle annonce</span>
                </div>
              </Button>
            )}
          </form>
        </Form>
      </div>
      <AlertDialogPost
        icode={icode}
        value={openAlert}
        set={setOpenAlert}
      />
    </>
  );
}
