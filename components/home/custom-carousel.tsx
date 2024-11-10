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
import { Separator } from "../ui/separator";

interface Props {
  posts?: Post[] | null;
  title: string;
}

const CustomCarousel: React.FC<Props> = ({ posts, title }) => {
  if (!posts || posts.length === 0) {
    return <h3 className="text-xl md:text-2xl font-bold">{title}</h3>;
  }

  return (
    <>
      <h4 className="text-xl md:text-2xl font-bold text-center md:text-left">
        {title}
      </h4>
      <Separator />
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
        className="w-full md:max-w-[1200px] md:mx-auto md:px-4">
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

export default CustomCarousel;
