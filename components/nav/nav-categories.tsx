"use client";

import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AllCategoriesButton } from "@/components/nav/all-categories-button";
import { usePathname } from "next/navigation";

const NavCategories = () => {
  const [categories, setCategories] = useState<Category[] | null>();
  const pathname = usePathname();

  const fetchCategory = async () => {
    if (categories) return;
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategory();
  }, [categories]);

  if (!categories) return <div></div>;

  return (
    <>
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <div></div>
      ) : (
        <div className="bg-white w-full shadow-lg">
          <div className="flex justify-between items-center py-4 mx-[250px]">
            {categories.slice(0, 7).map((category) => (
              <div
                className="flex"
                key={category.id}>
                <Button
                  variant={"ghost"}
                  className="h-full">
                  <Link
                    href={"/category?id=" + category.id}
                    className={`flex flex-row items-center gap-x-2 font-bold `}>
                    <img
                      src={category.icon}
                      alt={
                        category.altIcon
                          ? category.altIcon
                          : "icon de catégorie"
                      }
                      className="w-[42px] h-[42px]"
                    />
                    <span>
                      {category.name.slice(0, 1).toUpperCase() +
                        category.name.slice(1).toLowerCase()}
                    </span>
                  </Link>
                </Button>
              </div>
            ))}
            <div className="flex gap-x-4 items-center">
              <AllCategoriesButton categories={categories} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavCategories;
