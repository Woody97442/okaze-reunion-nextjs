"use client";

import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";

export const SendMessageButton = ({ id }: { id: string }) => {
  const handleClickMessage = () => {
    //TODO: Send Message to user
    console.log("clicked");
  };

  return (
    <Button
      onClick={handleClickMessage}
      variant={"default"}
      className="w-full gap-4 text-white">
      <FiSend className="w-[20px] h-[20px] " />
      Message
    </Button>
  );
};
