"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/schemas";
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
import { FormError } from "@/components/form-components/form-error";
import { FormSuccess } from "@/components/form-components/form-success";
import { login } from "@/actions/login";
import { FaArrowRight } from "react-icons/fa6";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "E-mail déjà utilisé avec un autre fournisseur !"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data) {
            if (data?.error) {
              form.reset();
              setError(data.error);
            }

            if (data?.success) {
              form.reset();
              setSuccess(data.success);
            }

            if (data?.twoFactor) {
              setShowTwoFactor(true);
            }
          }
        })
        .catch(() => {
          setError("Quelque chose s'est mal passé !");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="Pas de compte ?"
      backButtonHref="/auth/register"
      showSocial>
      {showTwoFactor ? (
        <p className="text-sm text-muted-foreground text-center max-w-xs mx-auto mb-3">
          Un code de double authentification a été envoyé à votre adresse email
          !
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center max-w-xs mx-auto mb-3">
          Connectez-vous pour découvrir toutes nos fonctionnalités.
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name={"code"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Double authentification</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                      <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className=" px-0 font-bold">
                        <Link href="/auth/reset">Mot de passe oublié ?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}>
            <div className="w-full flex justify-center gap-x-2 items-center">
              {showTwoFactor ? "Confirmer" : "Se Connecter"}
              <FaArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
