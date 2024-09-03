import { ContentMessage } from "@/prisma/content-message/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ExtractTimeFromISO, FormatDateForMessage } from "@/lib/format-date";
import FindUserContext from "@/lib/user-context-provider";
import { FaUser } from "react-icons/fa6";
import { Separator } from "../ui/separator";

export default function MessageBlock({
  messageUser,
}: {
  messageUser: ContentMessage;
}) {
  const { currentUser } = FindUserContext();
  const user = messageUser.user;
  return (
    <div className="my-4">
      {messageUser.userId === currentUser?.id ? (
        <>
          <Separator className="mb-2" />
          <div className="flex justify-center">
            <p>{FormatDateForMessage(messageUser.createdAt)}</p>
          </div>
          <div className="flex justify-start gap-4 flex-row">
            <Avatar className="h-[30px] w-[30px] md:h-[45px] md:w-[45px] -translate-y-4">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-[#2D8653]">
                <FaUser className="text-white w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="w-auto">
              <div className="p-5 bg-gray-200 my-2 shadow-md rounded-md text-left">
                <p>{messageUser.content}</p>
              </div>
              <div className="flex justify-start my-2">
                <span className="text-sm text-muted-foreground gap-2 flex">
                  <span>{user?.name || user?.username || user?.email}</span>
                  <span>{ExtractTimeFromISO(messageUser.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Separator className="mb-2" />
          <div className="flex justify-center">
            <p>{FormatDateForMessage(messageUser.createdAt)}</p>
          </div>
          <div className="flex justify-end gap-4 flex-row">
            <div className="w-auto">
              <div className="p-5 bg-gray-200 my-2 shadow-md rounded-md text-right">
                <p>{messageUser.content}</p>
              </div>
              <div className="flex justify-end my-2">
                <span className="text-sm text-muted-foreground gap-2 flex">
                  <span>{user?.name || user?.username || user?.email}</span>
                  <span>{ExtractTimeFromISO(messageUser.createdAt)}</span>
                </span>
              </div>
            </div>
            <Avatar className="h-[30px] w-[30px] md:h-[45px] md:w-[45px] -translate-y-4">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-[#2D8653]">
                <FaUser className="text-white w-6 h-6" />
              </AvatarFallback>
            </Avatar>
          </div>
        </>
      )}
    </div>
  );
}
