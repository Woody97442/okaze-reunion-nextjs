import { ContentMessage } from "@/prisma/content-message/types";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ExtractTimeFromISO, FormatDateForMessage } from "@/lib/format-date";
import FindUserContext from "@/lib/user-context-provider";

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
          <div className="flex justify-center">
            <p>{FormatDateForMessage(messageUser.createdAt)}</p>
          </div>
          <div className="flex justify-start gap-4 flex-row">
            <Avatar className="h-[45px] w-[45px] -translate-y-4">
              <AvatarImage src={user?.image || ""} />
            </Avatar>
            <div className="w-full">
              <div className="p-5 bg-gray-200 my-2 shadow-md rounded-md text-left">
                <p>{messageUser.content}</p>
              </div>
              <div className="flex justify-start my-2">
                <span className="text-sm text-muted-foreground">
                  {ExtractTimeFromISO(messageUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <p>{FormatDateForMessage(messageUser.createdAt)}</p>
          </div>
          <div className="flex justify-end gap-4 flex-row">
            <div className="w-full">
              <div className="p-5 bg-gray-200 my-2 shadow-md rounded-md text-right">
                <p>{messageUser.content}</p>
              </div>
              <div className="flex justify-end my-2">
                <span className="text-sm text-muted-foreground">
                  {ExtractTimeFromISO(messageUser.createdAt)}
                </span>
              </div>
            </div>
            <Avatar className="h-[45px] w-[45px] -translate-y-4">
              <AvatarImage src={user?.image || ""} />
            </Avatar>
          </div>
        </>
      )}
    </div>
  );
}
