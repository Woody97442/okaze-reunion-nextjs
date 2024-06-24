"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { BsHeart, BsBoxSeam } from "react-icons/bs";

import Image from "next/image";
import Link from "next/link";

import { CategoryWithPosts } from "@/prisma/types/category";

const CarouselCategories = ({ props }: { props?: CategoryWithPosts }) => {
  if (!props) return null;

  const { posts, name } = props;

  return (
    <>
      <h1 className={"text-2xl text-black drop-shadow-md "}>
        Nouvelles Offres / {name}
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
          {Array.from({ length: 30 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/4 lg:basis-1/5">
              <Link
                href={"/post?id=" + index}
                className="h-auto flex rounded-md w-auto">
                <div className="p-1">
                  <Card>
                    <Image
                      alt="Product image"
                      className="aspect-video w-full rounded-md rounded-b-none object-cover"
                      height="300"
                      src="/images/posts/four.webp"
                      width="300"
                    />
                    <CardHeader>
                      <CardTitle> Meubles et électroménager</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        11/05/2024
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <p className="text-sm">Prix : 1 500 €</p>
                        <div className="flex gap-x-4">
                          <BsHeart className="w-6 h-6" />
                          <BsBoxSeam className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
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
