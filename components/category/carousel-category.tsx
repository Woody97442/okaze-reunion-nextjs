"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import CardPost from "@/components/post/card-post";
import { Post } from "@/prisma/post/types";

interface Props {
  posts?: Post[] | null;
  categoryName: string;
}

const CarouselCategories: React.FC<Props> = ({ posts, categoryName }) => {
  if (!posts || posts.length === 0) {
    return (
      <h1 className="text-2xl text-black drop-shadow-md">
        Nouvelles Offres / {categoryName}
      </h1>
    );
  }

  return (
    <>
      <h1 className="text-2xl text-black drop-shadow-md">
        Nouvelles Offres / {categoryName}
      </h1>
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-[1400px] mx-auto px-4">
        <CarouselContent>
          {posts
            .sort((a, b) => b!.createdAt.getTime() - a!.createdAt.getTime())
            .slice(0, 20)
            .map(
              (post) =>
                post && (
                  <CarouselItem
                    key={post.id}
                    className=" md:basis-1/4 lg:basis-1/5">
                    <CardPost post={post} />
                  </CarouselItem>
                )
            )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default CarouselCategories;
