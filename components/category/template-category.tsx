"use client";

import { CategoryWithPosts } from "@/prisma/types/category";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import CarouselCategories from "@/components/category/carousel-category";
import LeftColumn from "@/components/category/left-column";
import BannerH from "@/components/banner/banner-h";
import RightColumn from "@/components/category/right-column";
import LoaderOkaze from "@/components/utils/loader";

const TemplateCategory = () => {
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

  if (!category) return <LoaderOkaze />;

  return (
    <>
      <BannerH variant="1" />
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-[250px] rounded-sm">
        <CarouselCategories props={category} />
      </div>
      <div className="flex flex-row space-x-6 mx-[250px] h-full ">
        <aside className="flex flex-col gap-y-4 bg-white w-1/3 py-4 px-12 shadow-md rounded-sm">
          <LeftColumn />
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-12 shadow-md rounded-sm">
          <RightColumn props={category} />
        </section>
      </div>
      <BannerH variant="2" />
    </>
  );
};

export default TemplateCategory;
