"use client";

import { Button } from "@/components/ui/button";
import { FaLock } from "react-icons/fa6";

export const BookButton = ({ id }: { id: string }) => {
  const handleClickBook = () => {
    //TODO: Book post
    console.log("clicked");
  };

  return (
    <Button
      onClick={handleClickBook}
      variant={"secondary"}
      className="w-full gap-4 text-white">
      <FaLock className="w-[20px] h-[20px] " />
      Réserver
    </Button>
  );
};
