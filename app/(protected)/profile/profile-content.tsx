"use client";

import * as z from "zod";
import { FormatDate } from "@/lib/format-date";
import { User } from "@/prisma/user/types";
import React, { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCircleXmark, FaUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import UploadeFileForm from "@/components/form-components/uploade-file-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@/schemas";
import { FaCheckCircle } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteUser, EnabledTowFactor, UpdateUser } from "@/actions/user";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FindUserContext from "@/lib/user-context-provider";

const ProfileContent = () => {
  const { currentUser, setCurrentUser } = FindUserContext();
  const [tempFile, setTempFile] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  // Définir l'état isGoogleAccount uniquement lorsque currentUser change
  useEffect(() => {
    if (currentUser?.Account?.provider === "google") {
      setIsGoogleAccount(true);
    } else {
      setIsGoogleAccount(false);
    }
  }, [currentUser]);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: (currentUser?.username as string) || "",
      postalCode: (currentUser?.postalCode as string) || "",
      gender: (currentUser?.gender as string) || "",
      phoneNumber: (currentUser?.phoneNumber as string) || "",
      password: "",
      confirm_password: "",
    },
  });

  const { watch } = form;
  const password = watch("password", "");

  const onSubmit = (values: z.infer<typeof UserSchema>) => {
    startTransition(() => {
      UpdateUser(values).then((data) => {
        if (data) {
          if (data?.success) {
            toast({
              title: "Succès",
              description: data?.success,
            });
            const userUpdate = {
              ...currentUser,
              username: values.username,
              postalCode: values.postalCode,
              gender: values.gender,
              phoneNumber: values.phoneNumber,
              password: values.password,
            };
            setCurrentUser(userUpdate as User);
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

  const handleDeleteAccount = () => {
    startTransition(() => {
      DeleteUser().then((data) => {
        if (data) {
          if (data?.error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: data?.error,
            });
          } else {
            setCurrentUser(null);
          }
        }
      });
    });
  };

  const handleEnabledTowFactor = (enabled: boolean) => {
    startTransition(() => {
      EnabledTowFactor(enabled).then((data) => {
        if (data) {
          if (data?.success) {
            const userUpdated = {
              ...currentUser,
              isTwoFactorEnabled: data.TwoFactor,
            };
            setCurrentUser(userUpdated as User);
            toast({
              title: "Succès",
              description: data?.success,
            });
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

  return (
    <>
      {currentUser && (
        <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 h-full w-full">
          <section className="flex flex-col gap-y-10 bg-white w-full py-4 px-8 shadow-md rounded-sm">
            <h1 className="text-2xl font-bold text-center ">
              Informations du compte
            </h1>
            <div className="flex flex-col gap-y-6 max-w-md">
              <p className="flex justify-between">
                <Label className="font-bold text-md">
                  Date de création du compte :{" "}
                </Label>
                {FormatDate(currentUser.createdAt)}
              </p>
              <p className="flex justify-between">
                <Label className="font-bold text-md">Email : </Label>
                {currentUser.email}
              </p>
              <p className="flex justify-between">
                <Label className="font-bold text-md">Email verifier : </Label>
                {currentUser.emailVerified ? "✔️" : "❌"}
              </p>
              <p className="flex justify-between">
                <Label className="font-bold text-md">
                  Nombre de lot créés :{" "}
                </Label>
                {currentUser.lot.length}
              </p>
              <p className="flex justify-between">
                <Label className="font-bold text-md">
                  Nombre de post dans les favoris :
                </Label>
                {currentUser.favorite ? currentUser.favorite.posts.length : 0}
              </p>
              <p className="flex justify-between">
                <Label className="font-bold text-md">
                  Nombre de conversations :{" "}
                </Label>
                {currentUser.messages.length}
              </p>
              <p className="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4 md:gap-y-0">
                <Label className="font-bold text-md">
                  Double Authentification :{" "}
                </Label>
                <div className="flex flex-row space-x-6 items-center">
                  {currentUser.isTwoFactorEnabled ? (
                    <span className="text-sm font-bold text-white bg-[#2d8653] px-2 py-1 rounded">
                      Activé
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-white bg-red-500 px-2 py-1 rounded">
                      Désactivé
                    </span>
                  )}
                  <Switch
                    id="airplane-mode"
                    checked={currentUser.isTwoFactorEnabled}
                    onCheckedChange={(e) => handleEnabledTowFactor(e.valueOf())}
                  />
                </div>
              </p>
              <Dialog>
                <DialogTrigger className="flex justify-start">
                  <div className=" text-xs bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer">
                    Supprimer mon compte !
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center text-xl font-bold">
                      Voulez-vous vraiment supprimer votre compte ?{" "}
                    </DialogTitle>
                    <DialogDescription>
                      <Alert
                        variant="destructive"
                        className="w-full text-center ">
                        <AlertDescription className="flex flex-col">
                          <strong className="text-lg text-center">
                            Attention cette action est definitive
                          </strong>
                          <strong className="text-2xl text-center">
                            ⚠ ⚠ ⚠ ⚠
                          </strong>
                        </AlertDescription>
                      </Alert>
                    </DialogDescription>
                    <Button
                      type="submit"
                      variant={"destructive"}
                      className="flex justify-center"
                      disabled={isPending}
                      onClick={handleDeleteAccount}>
                      Confirmer la Suppression de mon compte !
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
            <h1 className="text-2xl font-bold text-center mb-2">Mon Profil</h1>
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4 items-center ">
                <Avatar className="h-[100px] w-[100px] ">
                  <AvatarImage src={currentUser?.image || "" || tempFile} />
                  <AvatarFallback className="bg-[#2D8653]">
                    <FaUser className="text-white w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                {isGoogleAccount ? (
                  <div className="flex flex-col gap-y-2 justify-center text-center">
                    <h2 className="text-lg">
                      {" "}
                      Image de profil Google vous ne pouvez pas la modifier !
                    </h2>
                    <span className="text-sm  flex justify-center gap-2 font-bold">
                      {" "}
                      Modifier la sur Google
                      <a
                        href="https://myaccount.google.com/personal-info?utm_source=chrome-settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2D8653] font-bold underline">
                        Mon compte Google
                      </a>
                    </span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center gap-x-4">
                    <UploadeFileForm
                      setCurrentUser={setCurrentUser}
                      setTempFile={setTempFile}
                      user={currentUser}
                    />
                  </div>
                )}
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-6 justify-center">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={"username"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom d&#39;utilisateur :</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder={currentUser?.username || ""}
                                type="text"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"postalCode"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Postale :</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder={
                                  (currentUser.postalCode as string) || "974.."
                                }
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={"gender"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre :</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={
                                  (currentUser.gender as string) || ""
                                }>
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      (currentUser.gender as string) || "Homme"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value={"Homme"}>
                                      Homme
                                    </SelectItem>
                                    <SelectItem value={"Femme"}>
                                      Femme
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={"phoneNumber"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone :</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="..."
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-6 justify-center">
                    <FormField
                      control={form.control}
                      name={"password"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe :</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending || isGoogleAccount}
                              placeholder="..."
                              type="password"
                              autoComplete="*********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={"confirm_password"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmation Mot de passe :</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending || isGoogleAccount}
                              placeholder="..."
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isGoogleAccount ? (
                    <div></div>
                  ) : (
                    <div className="space-y-2 flex flex-row  justify-around items-center py-2">
                      <ul className="flex flex-col gap-y-2">
                        <li>
                          <div className="flex justify-between gap-x-4 items-center ">
                            <p className="text-xs">Un chiffre</p>
                            {/[0-9]/.test(password) ? (
                              <FaCheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <FaCircleXmark className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between gap-x-4 items-center ">
                            <p className="text-xs">Une majuscule</p>
                            {/[A-Z]/.test(password) ? (
                              <FaCheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <FaCircleXmark className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </li>
                      </ul>
                      <ul className="flex flex-col gap-y-2">
                        <li>
                          <div className="flex justify-between gap-x-4 items-center ">
                            <p className="text-xs">Min 6 caractères</p>
                            {password.length >= 6 ? (
                              <FaCheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <FaCircleXmark className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between gap-x-4 items-center ">
                            <p className="text-xs">Un caractère @/*</p>
                            {/[^a-zA-Z0-9]/.test(password) ? (
                              <FaCheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <FaCircleXmark className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}>
                    <div>Enregistrer</div>
                  </Button>
                </form>
              </Form>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProfileContent;
