"use client";

import { updateFavorite } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Post } from "@/prisma/post/types";
import { useEffect, useState, useTransition } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

export const AddFavoritesButton = ({ post }: { post: Post }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const [currentIsFavorite, setCurrentIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const storedFavorites = JSON.parse(
        sessionStorage.getItem("favorite_posts") || "[]"
      );
      setCurrentIsFavorite(storedFavorites.includes(post.id));

      if (!sessionStorage.getItem("favorite_posts")) {
        sessionStorage.setItem("favorite_posts", JSON.stringify([]));
        let storedFavorites = JSON.parse(
          sessionStorage.getItem("favorite_posts") || "[]"
        );
        if (!storedFavorites.includes(post.id)) {
          storedFavorites.push(post.id);
        } else {
          storedFavorites = storedFavorites.filter(
            (postId: string) => postId !== post.id
          );
        }
        sessionStorage.setItem(
          "favorite_posts",
          JSON.stringify(storedFavorites)
        );
      }
    }
  }, [post.id, user]);

  const handleClickFavorite = () => {
    if (user) {
      startTransition(() => {
        updateFavorite(post.id).then((data) => {
          if (data) {
            if (data?.success) {
              toast({
                title: "Succès",
                description: data?.success,
                action: (
                  <ToastAction altText={"Consulter"}>Consulter</ToastAction>
                ),
              });

              const newFavoriteState = !currentIsFavorite;
              setCurrentIsFavorite(newFavoriteState);

              let storedFavorites = JSON.parse(
                sessionStorage.getItem("favorite_posts") || "[]"
              );

              if (!storedFavorites.includes(post.id)) {
                storedFavorites.push(post.id);
              } else {
                storedFavorites = storedFavorites.filter(
                  (postId: string) => postId !== post.id
                );
              }

              sessionStorage.setItem(
                "favorite_posts",
                JSON.stringify(storedFavorites)
              );
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleClickFavorite}
            disabled={isPending}
            className=" hover:bg-white p-0">
            {currentIsFavorite ? (
              <BsHeartFill className="w-6 h-6 fill-red-500 cursor-pointer hover:scale-110 transition-all" />
            ) : (
              <BsHeart className="w-6 h-6 hover:fill-red-500 cursor-pointer hover:scale-110 transition-all" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary ">
          <p>Ajouter aux favoris</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
