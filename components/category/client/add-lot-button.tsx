"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsBoxSeam } from "react-icons/bs";

export const AddLotButton = ({ id }: { id: string }) => {
  const CreateLot = () => {
    //TODO: Créer un lot
    console.log("Créer un lot id : " + id);
  };
  const AddLot = () => {
    //TODO: Ajouter l'ajout au lot
    console.log("Ajout au lot id : " + id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none flex flex-row items-center gap-x-2 font-bold">
        <BsBoxSeam className="w-6 h-6 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto bg-white px-2"
        align="end">
        <DropdownMenuItem
          className="gap-x-3"
          onClick={CreateLot}>
          <p>Créer un lot</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-x-3"
          onClick={AddLot}>
          <p>Ajouter à un lot</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
