"use client";

import { FormatDate } from "@/lib/format-date";
import { User } from "@/prisma/user/types";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import UploadeFileForm from "./uploade-file-form";

const Content = ({ user }: { user: User }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [tempFile, setTempFile] = useState("");

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (!currentUser) return <></>;

  return (
    <>
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-col gap-y-10 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <h1 className="text-2xl font-bold text-center ">
            Informations du compte
          </h1>
          <div className="flex flex-col gap-y-6 max-w-md">
            <p className="flex justify-between">
              <span className="font-bold">Date de création du compte : </span>
              {FormatDate(currentUser.createdAt)}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Email : </span>
              {currentUser.email}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Email verifier : </span>
              {currentUser.emailVerified ? "✔️" : "❌"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Nombre de lot créés : </span>
              {currentUser.lot.length}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">
                Nombre de post dans les favoris :
              </span>
              {currentUser.favorite ? currentUser.favorite.posts.length : 0}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Nombre de conversations : </span>
              {currentUser.messages.length}
            </p>
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
              <div className="w-full flex justify-center gap-x-4">
                <UploadeFileForm
                  setCurrentUser={setCurrentUser}
                  setTempFile={setTempFile}
                  user={currentUser}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between my-2 ">
              <div className="flex flex-col gap-y-3 ">
                <div className="flex flex-col gap-y-3 items-start ">
                  <p className="font-bold">Nom d'utilisateur :</p>
                  <div>
                    <Input
                      type="text"
                      placeholder={currentUser.username || ""}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 items-start">
                  <p className="font-bold">Code Postale :</p>
                  <div>
                    <Input
                      type="text"
                      placeholder={"97419"}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-3 ">
                <div className="flex flex-col gap-y-3 items-start">
                  <p className="font-bold">Genre :</p>
                  <div>
                    <Input
                      type="text"
                      placeholder={"Homme"}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 items-start">
                  <p className="font-bold">Numéro de téléphone :</p>
                  <div>
                    <Input
                      type="text"
                      placeholder={"06 00 00 00 00"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col gap-y-3 items-start">
                <p className="font-bold">Mot de passe :</p>
                <div>
                  <Input
                    type="password"
                    placeholder={"*********"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-3 items-start">
                <p className="font-bold">Confirmation Mot de passe :</p>
                <div>
                  <Input
                    type="password"
                    placeholder={""}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant={"default"}>
              Enregistrer
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Content;
