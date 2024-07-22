"use client";

import { Button } from "@/components/ui/button";
import { FaLock } from "react-icons/fa6";
import { toast } from "../ui/use-toast";

export const BookButton = ({ id }: { id: string }) => {
  const handleClickBook = () => {
    //TODO: Book post
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Bientot disponible",
    });
  };

  return (
    <Button
      onClick={handleClickBook}
      variant={"secondary"}
      className="w-full gap-4 text-white"
      disabled>
      <FaLock className="w-[20px] h-[20px] " />
      Réserver
    </Button>
  );
};
