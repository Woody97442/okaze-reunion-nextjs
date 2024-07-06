"use client";

import { DeleteImageProfile, UploadImageProfile } from "@/actions/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/prisma/user/types";
import { FormEventHandler, useState, useTransition } from "react";
import { compressFile } from "@/lib/compress-image";
import { PulseLoader } from "react-spinners";
import { FiTrash2 } from "react-icons/fi";

export default function UploadeFileForm({
  setCurrentUser,
  setTempFile,
  user,
}: {
  setCurrentUser: (user: User) => void;
  setTempFile: (file: string) => void;
  user: User;
}) {
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    setDisabled(true);
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une image est requise !",
      });
      setDisabled(false);
      return;
    }

    if (file.size > 2100000) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Image trop volumineuse !",
      });
      setDisabled(false);
      return;
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Seul les fichiers PNG et JPEG sont autorisés !",
      });
      setDisabled(false);
      return;
    }

    startTransition(() => {
      compressFile(file).then((data) => {
        if (data) {
          formData = new FormData();
          formData.append("file", data);

          UploadImageProfile(formData, user?.image as string).then((data) => {
            if (data) {
              if (data?.success) {
                const userUrl = data.url;
                if (userUrl && user) {
                  const userUpdated = { ...user, image: userUrl };
                  setCurrentUser(userUpdated);
                }
                toast({
                  title: "Succès",
                  description: data?.success,
                });
                setDisabled(false);
              }
              if (data?.error) {
                toast({
                  variant: "destructive",
                  title: "Erreur",
                  description: data?.error,
                });
                setDisabled(false);
              }
            }
          });
        }
      });
    });
  };

  const deleteImage = async (urlImage: string) => {
    setDisabled(true);

    startTransition(() => {
      DeleteImageProfile(urlImage).then((data) => {
        if (data) {
          if (data?.success) {
            const userUrl = data.url;
            if (user) {
              const userUpdated = { ...user, image: userUrl };
              setCurrentUser(userUpdated);
            }
            toast({
              title: "Succès",
              description: data?.success,
            });
            setDisabled(false);
          }
          if (data?.error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: data?.error,
            });
            setDisabled(false);
          }
        }
      });
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-x-2">
        <Input
          className="col-span-3 cursor-pointer"
          type="file"
          name="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const tempFile = URL.createObjectURL(file);
              setTempFile(tempFile);
            }
          }}
        />
        <Button
          type="submit"
          variant={"secondary"}
          className="text-white"
          disabled={disabled}>
          {disabled ? (
            <PulseLoader
              color="#ffffff"
              size={10}
            />
          ) : (
            "Importer"
          )}
        </Button>
      </form>
      <Button
        type="submit"
        variant={"ghost"}
        disabled={disabled}
        onClick={() => deleteImage(user?.image as string)}>
        <FiTrash2 className="w-[24px] h-[24px] cursor-pointer" />
      </Button>
    </>
  );
}
