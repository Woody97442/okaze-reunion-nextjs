"use client";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@prisma/client";

import CarouselCategories from "@/components/category/carousel";
import LeftColumn from "@/components/category/left-column";
import RightColumn from "@/components/category/right-column";
import { Separator } from "@/components/ui/separator";
import { CategoryWithPosts } from "@/prisma/types/category";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const idCategory = searchParams.get("id");
  const [category, setCategory] = useState<CategoryWithPosts | null>();

  const fetchCategory = async () => {
    const response = await fetch(`/api/categories?id=${idCategory}`);
    const data = await response.json();
    setCategory(data);
  };

  useEffect(() => {
    fetchCategory();
  }, [idCategory]);

  return (
    <main className="flex flex-col py-8 space-y-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-12 rounded-sm">
        <h1
          className={cn("text-2xl text-black drop-shadow-md ", font.className)}>
          Nouvelles Offres / {category?.name}
        </h1>
        <CarouselCategories />
      </div>
      <div className="flex flex-row space-x-12 mx-12 h-full ">
        <aside className="flex flex-col gap-y-4 bg-white w-1/4 py-4 px-12 shadow-md rounded-sm">
          <LeftColumn />
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-12 shadow-md rounded-sm">
          <div className="space-y-4 my-2">
            <h2
              className={cn(
                "text-2xl text-black drop-shadow-md ",
                font.className
              )}>
              {category?.name}
            </h2>
          </div>
          <Separator />
          <RightColumn post={category?.posts as unknown as Post} />
        </section>
      </div>
    </main>
  );
};

export default CategoriesPage;
