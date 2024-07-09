"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CardPost from "@/components/post/client/card-post";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import FindUserContext from "@/lib/user-context-provider";
import { Post } from "@/prisma/post/types";

const FavoritesContent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const { currentUserFavorite } = FindUserContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(currentSearch);
    }
  };

  const filteredPosts = currentUserFavorite?.favorite?.posts.filter(
    (post) =>
      (post &&
        post.title &&
        post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.description &&
        post.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="flex flex-row space-x-6 h-full w-full">
        <aside className="flex flex-col gap-y-4 bg-white w-1/3 py-4 px-8 shadow-md rounded-sm">
          <div className="space-y-4 my-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={currentSearch}
                onChange={(e) => {
                  setCurrentSearch(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                variant={"default"}
                onClick={() => setSearchTerm(currentSearch)}>
                <FiSearch className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
          <Separator />
          <Image
            alt={"Bannier publicitaire vertical 1"}
            width="300"
            height="800"
            className="object-fit rounded-md my-auto"
            src={"/images/banner/banner_v_1.jpg"}
          />
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <>
            {!currentUserFavorite?.favorite?.posts ||
            currentUserFavorite?.favorite?.posts.length === 0 ? (
              <h1 className="text-2xl text-black">Aucun favoris</h1>
            ) : (
              <>
                <div className="space-y-4 my-2">
                  <h2 className="text-2xl text-black drop-shadow-md">
                    Mes Favoris
                  </h2>
                </div>
                <Separator />
                <ScrollArea className="h-[650px] w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 mx-6">
                    {filteredPosts?.map((post, index) => (
                      <div
                        key={post.id}
                        className={`animate-fadeIn`}
                        style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardPost post={post as Post} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </>
        </section>
      </div>
    </>
  );
};

export default FavoritesContent;
