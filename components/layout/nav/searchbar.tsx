"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

export const SearchBar = () => {
  //TODO: Add a search bar function

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Rechercher..."
        className="font-Lato"
      />
      <Button
        type="submit"
        variant={"default"}>
        <FiSearch className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};
