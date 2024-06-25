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
import CardCategory from "@/components/category/client/card-category";
import { Post } from "@prisma/client";

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
        className="w-full max-w-[1400px] mx-auto">
        <CarouselContent className="-ml-1">
          {posts.map((post) => (
            <CarouselItem
              key={post.id}
              className="pl-1 md:basis-1/4 lg:basis-1/5">
              <CardCategory post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default CarouselCategories;
