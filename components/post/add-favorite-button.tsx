"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import FindUserContext from "@/lib/user-context-provider";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { updateFavorite } from "@/actions/favorite";
import { toast } from "@/components/ui/use-toast";
import { Post } from "@/prisma/post/types";
import { UserFavorite } from "@/prisma/user/types";

export const AddFavoriteButton = ({ post }: { post: Post }) => {
  const { currentUserFavorite, setCurrentUserFavorite } = FindUserContext();
  const [isPending, startTransition] = useTransition();
  const postId = post.id;

  const addFavorite = () => {
    if (currentUserFavorite) {
      startTransition(() => {
        updateFavorite(postId).then((data) => {
          if (data) {
            if (data?.success) {
              toast({
                title: "Succès",
                description: data?.success,
              });
              if (data.isFavorites) {
                const favorites = currentUserFavorite.favorite?.posts;
                if (!favorites) return;

                const updatedFavorites = [...favorites, post];

                const favoriteUpdated = {
                  ...currentUserFavorite,
                  favorite: {
                    ...currentUserFavorite.favorite,
                    posts: updatedFavorites,
                  },
                };

                // Mettre à jour l'état
                setCurrentUserFavorite(favoriteUpdated as UserFavorite);
              } else if (!data.isFavorites) {
                const favorites = currentUserFavorite.favorite?.posts;
                if (!favorites) return;
                const updatedFavorites = favorites.filter(
                  (favorite) => favorite.id !== postId
                );
                const favoriteUpdated = {
                  ...currentUserFavorite,
                  favorite: {
                    ...currentUserFavorite.favorite,
                    posts: updatedFavorites,
                  },
                };
                setCurrentUserFavorite(favoriteUpdated as UserFavorite);
              }
            }
            if (data?.error) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: data?.error,
              });
            }
          }
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez vous connecter pour ajouter aux favoris",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={addFavorite}
      disabled={isPending}
      className=" hover:bg-white p-0">
      {currentUserFavorite?.favorite?.posts.some(
        (post) => post.id === postId
      ) ? (
        <BsHeartFill className="w-6 h-6 fill-red-500 cursor-pointer hover:scale-110 transition-all" />
      ) : (
        <BsHeart className="w-6 h-6 hover:fill-red-500 cursor-pointer hover:scale-110 transition-all" />
      )}
    </Button>
  );
};
