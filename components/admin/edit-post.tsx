"use client";

import * as z from "zod";
import { TbCamera } from "react-icons/tb";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatPostSchema } from "@/schemas";
import { Card } from "../ui/card";
import Image from "next/image";
import { FaArrowDown, FaXmark } from "react-icons/fa6";
import { toast } from "../ui/use-toast";
import { compressIcon, compressImagePost } from "@/lib/compress-image";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Category } from "@/prisma/category/types";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CreateCategory } from "@/actions/admin/categories";
import { UploadIcon } from "@/actions/admin/upload-icon";
import FindAdminContext from "@/lib/admin-context-provider";
import { Attribut } from "@/prisma/attribut/types";
import { CreateAttribut } from "@/actions/admin/attributes";
import { Post } from "@/prisma/post/types";
import { $Enums, Image as ImageType } from "@prisma/client";
import { CreatePost } from "@/actions/admin/post";
import LoaderOkaze from "../utils/loader";
import { UploadImage } from "@/actions/admin/upload-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DeleteImage } from "@/actions/admin/delete-image";

interface PropsImagesPost {
  file: File;
  fileUrl: string;
}

type Image = ImageType;

export default function EditPost() {
  const {
    allPosts,
    setAllPosts,
    allCategories,
    setAllCategories,
    allAttributes,
    setAllAttributes,
    currentPostEdit,
    setCurrentPostEdit,
    setCurrentContent,
  } = FindAdminContext();
  console.log(currentPostEdit);

  if (!currentPostEdit) return setCurrentContent("posts");

  const [isPending, startTransition] = useTransition();
  const [currentCategoriesForPost, setCurrentCategoriesForPost] = useState<
    Category[]
  >(currentPostEdit.categories as Category[]);
  const [currentAttributsForPost, setCurrentAttributsForPost] = useState<
    Attribut[]
  >(currentPostEdit.attributs as Attribut[]);

  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);

  const [labelNewAttributs, setLabelNewAttributs] = useState("");
  const [labelNewCategory, setLabelNewCategory] = useState("");
  const [currentIcon, setCurrentIcon] = useState<string>("");
  const [currentFileIcon, setCurrentFileIcon] = useState<File | null>(null);
  const [currentFilePosts, setCurrentFilePosts] = useState<PropsImagesPost[]>(
    []
  );

  const [disabled, setDisabled] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [icodePostCreated, setIcodePostCreated] = useState<string>("0000");
  const form = useForm<z.infer<typeof CreatPostSchema>>({
    resolver: zodResolver(CreatPostSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      state: "new",
      categories: [],
      attributes: [],
      images: [],
    },
  });

  const onSubmit = (values: z.infer<typeof CreatPostSchema>) => {
    setDisabled(true);
    const postState = (values.state as $Enums.PostState) || "new";

    if (!currentCategoriesForPost || !currentCategoriesForPost.length) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez selectionner au moins une categorie",
      });
      setDisabled(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("state", postState);

    startTransition(() => {
      CreatePost(
        formData,
        currentCategoriesForPost,
        currentAttributsForPost
      ).then((data) => {
        if (data?.success) {
          if (currentFilePosts.length > 0) {
            const formDataImage = new FormData();

            for (let i = 0; i < currentFilePosts.length; i++) {
              formDataImage.append("images", currentFilePosts[i].file);
            }

            // Upload image
            UploadImage(formDataImage, data.post as Post).then((data) => {
              if (data) {
                if (data?.success) {
                  toast({
                    title: "Succès",
                    description: data?.success,
                  });
                  form.reset();
                  setOpenFirstDialog(false);
                  setOpenSecondDialog(false);
                  setCurrentFilePosts([]);
                  setCurrentCategoriesForPost([]);
                  setCurrentAttributsForPost([]);
                  setDisabled(false);
                  setAllPosts([...(allPosts || []), data?.newPost as Post]);
                  setDisabled(false);
                  if (data?.newPost?.icode) {
                    setIcodePostCreated(data.newPost?.icode);
                    setOpenAlert(true);
                  }
                } else {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: data?.error,
                  });
                  setDisabled(false);
                }
              }
            });
          } else {
            toast({
              title: "Succès",
              description: data?.success,
            });
            setDisabled(false);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setDisabled(false);
        }
      });
    });
  };

  const CreateNewCategory = () => {
    if (labelNewCategory) {
      startTransition(() => {
        if (currentFileIcon) {
          compressIcon(currentFileIcon as File).then((data) => {
            if (data) {
              const formData = new FormData();
              formData.append("file", data);

              UploadIcon(formData).then((data) => {
                if (data) {
                  if (data?.success) {
                    const iconUrl = data.url;
                    if (iconUrl) {
                      CreateCategory(labelNewCategory, iconUrl).then((data) => {
                        if (data?.success) {
                          setOpenSecondDialog(false);
                          setLabelNewCategory("");
                          setCurrentFileIcon(null);
                          const newCategories = [
                            ...(allCategories as Category[]),
                            data.category,
                          ];
                          setAllCategories(newCategories);
                          setCurrentCategoriesForPost([
                            ...currentCategoriesForPost,
                            data.category,
                          ]);
                          toast({
                            title: "Succès",
                            description: data?.success,
                          });
                          setOpenSecondDialog(false);
                        } else {
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: data?.error,
                          });
                          setOpenSecondDialog(false);
                        }
                      });
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Erreur",
                        description:
                          "Une erreur est survenue pendant l'upload de l'icône !",
                      });
                      setOpenSecondDialog(false);
                    }
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Erreur",
                      description: data?.error,
                    });
                    setOpenSecondDialog(false);
                  }
                } else {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur est survenue !",
                  });
                  setOpenSecondDialog(false);
                }
              });
            }
          });
        } else {
          CreateCategory(labelNewCategory).then((data) => {
            if (data?.success) {
              setOpenSecondDialog(false);
              setLabelNewCategory("");
              setCurrentFileIcon(null);
              const newCategories = [
                ...(allCategories as Category[]),
                data.category,
              ];
              setAllCategories(newCategories);
              setCurrentCategoriesForPost([
                ...currentCategoriesForPost,
                data.category,
              ]);
              toast({
                title: "Succès",
                description: data?.success,
              });
              setOpenSecondDialog(false);
            } else {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
              setOpenSecondDialog(false);
            }
          });
        }
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie ne doit pas étre vide !",
      });
      setOpenSecondDialog(false);
    }
  };

  const CreateNewAttribut = () => {
    if (labelNewAttributs) {
      startTransition(() => {
        CreateAttribut(labelNewAttributs).then((data) => {
          if (data?.success) {
            setOpenFirstDialog(false);
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
            setOpenFirstDialog(false);
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: data?.error,
            });
            setOpenFirstDialog(false);
          }
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de l'attribut ne doit pas étre vide !",
      });
      setOpenFirstDialog(false);
    }
  };

  const HandleAddImageToPost = (file: File) => {
    setDisabled(true);
    startTransition(() => {
      compressImagePost(file).then((dataImageCompressed) => {
        if (dataImageCompressed) {
          const postTableFile: PropsImagesPost = {
            file: dataImageCompressed,
            fileUrl: URL.createObjectURL(dataImageCompressed),
          };
          const tempFiles = [...currentFilePosts, postTableFile];
          setCurrentFilePosts(tempFiles);
          setDisabled(false);
        }
      });
    });
  };

  const deleteOldImageInThePost = (file: ImageType) => {
    setDisabled(true);
    startTransition(() => {
      DeleteImage(file).then((data) => {
        if (data.success) {
          toast({
            variant: "default",
            title: "Succès",
            description: data?.success,
          });
          setDisabled(false);
          const postEdited = currentPostEdit;
          postEdited.images = data.imageInPost;
          setCurrentPostEdit(postEdited);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setDisabled(false);
        }
      });
    });
  };

  return (
    <div className="space-y-4 my-2">
      <>
        {disabled && (
          <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0">
            <LoaderOkaze variant="light" />
          </div>
        )}
        <ScrollArea className="whitespace-nowrap">
          <div className="flex space-x-4 w-max p-4 pb-6">
            {currentPostEdit.images.length > 0 &&
              currentPostEdit.images.map((file, index) => (
                <Card
                  className="relative transition-transform duration-300 ease-in-out transform hover:scale-105"
                  key={index}>
                  <Image
                    alt="preview de l'image de l'annonce"
                    className="rounded-md w-40 h-40 object-cover"
                    width="160"
                    height="160"
                    src={file.src}
                  />
                  <Button
                    variant={"ghost"}
                    disabled={isPending}
                    onClick={() => {
                      deleteOldImageInThePost(file);
                    }}
                    className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                    <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-white" />
                  </Button>
                </Card>
              ))}
            {currentFilePosts.length > 0 &&
              currentFilePosts.map((file, index) => (
                <Card
                  className="relative transition-transform duration-300 ease-in-out transform hover:scale-105"
                  key={index}>
                  <Image
                    alt="preview de l'image de l'annonce"
                    className="rounded-md w-40 h-40 object-cover"
                    width="160"
                    height="160"
                    src={file.fileUrl}
                  />
                  <Button
                    variant={"ghost"}
                    disabled={isPending}
                    onClick={() => {
                      setCurrentFilePosts(
                        currentFilePosts.filter(
                          (f) => f.fileUrl !== file.fileUrl
                        )
                      );
                    }}
                    className="hover:bg-transparent p-0 hover:scale-110 transition-all absolute top-0 left-2 z-10">
                    <FaXmark className="w-[24px] h-[24px] cursor-pointer fill-white" />
                  </Button>
                </Card>
              ))}
            <div className="w-[160px] h-[160px] border-2 border-dashed rounded-md flex items-center justify-center">
              <TbCamera className="w-[34px] h-[34px]" />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex flex-row space-x-4 items-center">
          <Input
            className="cursor-pointer w-auto"
            type="file"
            name="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file && file.size > 0 && file.type.includes("image")) {
                HandleAddImageToPost(file);
              }
            }}
          />
          <span className="text-sm font-bold">
            Nombre d'images :{" "}
            {currentPostEdit.images.length + currentFilePosts.length}
          </span>
        </div>
      </>

      <Separator />

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
                      Titre de l'annonce
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={currentPostEdit.title}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"description"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          currentPostEdit.description || "accune description"
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
                <FormField
                  control={form.control}
                  name={"price"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Prix en €</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder={currentPostEdit.price.toString()}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <>
                  <div className="font-bold">Sélectionnez les attributs</div>
                  <Select
                    onValueChange={(field) => {
                      const selectedAttributes = allAttributes?.find(
                        (attributs) => attributs.id === field
                      );
                      if (selectedAttributes) {
                        setCurrentAttributsForPost([
                          ...currentAttributsForPost,
                          selectedAttributes,
                        ]);
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
                      open={openFirstDialog}
                      onOpenChange={setOpenFirstDialog}>
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
                            <div className="text-left">
                              Nom du nouvel attribut
                            </div>
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
                          disabled={disabled}>
                          Créer
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col space-y-3 border border-slate-300 rounded-md p-3 min-h-[100px]">
                    {currentAttributsForPost?.map((attribut) => (
                      <div
                        key={attribut.id}
                        className="flex flex-row items-center gap-x-2">
                        <FaXmark
                          className="cursor-pointer h-4 w-4 text-red-500"
                          onClick={() => {
                            setCurrentAttributsForPost(
                              currentAttributsForPost.filter(
                                (c) => c.id !== attribut.id
                              )
                            );
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
              </div>
              <div className="space-y-4 w-full">
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
                          defaultValue={currentPostEdit.state}>
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

                {/* Zone catégories */}
                <>
                  <div className="font-bold">Sélectionnez les catégories</div>
                  <Select
                    onValueChange={(field) => {
                      const selectedCategory = allCategories?.find(
                        (category) => category.id === field
                      );
                      if (selectedCategory) {
                        setCurrentCategoriesForPost([
                          ...currentCategoriesForPost,
                          selectedCategory,
                        ]);
                      }
                    }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={""} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allCategories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}>
                            <div className="flex flex-row items-center gap-x-4">
                              <Image
                                alt={category.altIcon || category.name}
                                width={30}
                                height={30}
                                className="w-[30px] h-[30px]"
                                src={category.icon || "/images/other.png"}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-row items-center justify-between font-bold">
                    <div className="flex flex-row items-center gap-x-2">
                      Catégories <FaArrowDown />
                    </div>
                    <Dialog
                      open={openSecondDialog}
                      onOpenChange={setOpenSecondDialog}>
                      <DialogTrigger>
                        <div className="text-white bg-secondary rounded-md px-3 py-2">
                          Nouvelle catégorie
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Créer une catégorie</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-8 py-4">
                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="name"
                              className="text-left">
                              Nom de la catégorie
                            </Label>
                            <Input
                              className="col-span-3"
                              onChange={(e) =>
                                setLabelNewCategory(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="name"
                              className="text-left w-full flex flex-row justify-between items-center">
                              Ajouter une icone a la catégorie
                              <span className="text-sm text-muted-foreground">
                                (2Mo maximum)
                              </span>
                            </Label>
                            <Input
                              className="cursor-pointer w-auto"
                              type="file"
                              name="file"
                              accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, image/avif"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (
                                  file &&
                                  file.size > 0 &&
                                  file.type.includes("image")
                                ) {
                                  const PreviewFile = URL.createObjectURL(file);
                                  setCurrentIcon(PreviewFile);
                                  setCurrentFileIcon(file);
                                }
                              }}
                            />
                            <span className="text-sm text-muted-foreground">
                              L'icône sera redimensionnée à 42x42.
                            </span>
                          </div>
                          <div className="flex flex-col gap-4">
                            <Label
                              htmlFor="name"
                              className="text-left">
                              prévisualisation de la catégorie
                            </Label>
                            <div className="flex flex-row items-center gap-4 p-2 bg-gray-100 w-fit">
                              <Image
                                alt="preview"
                                width={42}
                                height={42}
                                className="w-[42px] h-[42px]"
                                src={currentIcon || "/images/other.png"}
                              />
                              <span>{labelNewCategory || "exemple"}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={CreateNewCategory}
                          disabled={disabled}>
                          Créer
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col space-y-3 border border-slate-300 rounded-md p-3 min-h-[100px]">
                    {currentCategoriesForPost?.map((category) => (
                      <div
                        key={category.id}
                        className="flex flex-row items-center gap-x-2">
                        <FaXmark
                          className="cursor-pointer h-4 w-4 text-red-500"
                          onClick={() => {
                            setCurrentCategoriesForPost(
                              currentCategoriesForPost.filter(
                                (c) => c.id !== category.id
                              )
                            );
                          }}
                        />
                        <div className=" font-bold">
                          <div className="flex flex-row items-center gap-x-4">
                            <Image
                              alt={category.altIcon || category.name}
                              width={30}
                              height={30}
                              className="w-[30px] h-[30px]"
                              src={category.icon || "/images/other.png"}
                            />
                            {category.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
                {/* Zone catégories */}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}>
              <div className="w-full flex justify-center gap-x-2 items-center">
                <span>Modifier</span>
              </div>
            </Button>
          </form>
        </Form>
      </div>

      <AlertDialog
        open={openAlert}
        onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voici le Code unique de l'annonce
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col space-y-6">
                <p>
                  Ce code est le code unique de l'annonce. Il sera utilisé pour
                  supprimer l'annonce rapidement. Noté le sur le produit.
                </p>
                <strong className="text-secondary font-bold text-3xl text-center">
                  {" "}
                  {icodePostCreated}
                </strong>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIcodePostCreated("");
              }}>
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
