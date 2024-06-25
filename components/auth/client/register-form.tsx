"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/client/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";

import { FaArrowRight, FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

export const RedisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirm_password: "",
    },
  });

  const { watch } = form;
  const password = watch("password", "");

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="Vous avez déjà un compte"
      backButtonHref="/auth/login"
      showSocial>
      <p className="text-sm text-muted-foreground text-center max-w-xs mx-auto mb-3">
        Inscrivez-vous maintenant pour profiter pleinement de nos services.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@me.com"
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <div className="space-y-1 flex flex-row justify-between items-center pt-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"confirm_password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmez le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}>
            <div className="w-full flex justify-center gap-x-2 items-center ">
              S'inscrire
              <FaArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
