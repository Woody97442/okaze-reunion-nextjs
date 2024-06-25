"use client";

import { BsHeart } from "react-icons/bs";

export const AddFavoritesButton = ({ id }: { id: string }) => {
  const handleClickFavorite = () => {
    //TODO: Ajouter l'ajout au favoris
    console.log("clicked");
  };

  return (
    <BsHeart
      className="w-6 h-6 cursor-pointer"
      onClick={handleClickFavorite}
    />
  );
};
