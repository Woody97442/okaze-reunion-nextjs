"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContactFormSchema } from "@/schemas";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessage } from "@/actions/message";
import { Textarea } from "@/components/ui/textarea";

const ContactContent = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ContactFormSchema>) => {
    const formDataMessage = new FormData();

    formDataMessage.append("name", values.name);
    formDataMessage.append("email", values.email);
    formDataMessage.append("message", values.message);

    startTransition(() => {
      // Envoi du message de contact
      sendContactMessage(formDataMessage).then((data) => {
        if (data?.success) {
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
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <h2 className="text-2xl text-black drop-shadow-md font-bold">
            Formulaire de contact
          </h2>
          <div className="w-full md:w-1/2">
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
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Votre nom"
                            disabled={isPending}
                            type="text"
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
                            placeholder="Votre adresse e-mail"
                            disabled={isPending}
                            type="email"
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
                          <Textarea
                            {...field}
                            placeholder="Votre message"
                            disabled={isPending}
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
                  disabled={isPending}>
                  Envoyer le message
                </Button>
              </form>
            </Form>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactContent;
