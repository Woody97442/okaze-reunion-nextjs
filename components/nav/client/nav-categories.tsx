"use client";

import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa6";

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
          <div className="flex justify-between items-center py-4 container">
            {categories.slice(0, 7).map((category) => (
              <div
                className="flex"
                key={category.id}>
                <Button
                  variant={"ghost"}
                  className="h-full">
                  <Link
                    href={"/category/" + category.id}
                    className={`flex flex-row items-center gap-x-2 font-bold `}>
                    {category.icon ? (
                      <Image
                        src={category.icon}
                        alt={
                          category.altIcon
                            ? category.altIcon
                            : "icon de catégorie"
                        }
                        className="w-[42px] h-[42px]"
                        width={42}
                        height={42}
                      />
                    ) : (
                      <Image
                        src="/images/other.png"
                        alt={"icon de catégorie"}
                        className="w-[42px] h-[42px]"
                        width={42}
                        height={42}
                      />
                    )}
                    <span>
                      {category.name.slice(0, 1).toUpperCase() +
                        category.name.slice(1).toLowerCase()}
                    </span>
                  </Link>
                </Button>
              </div>
            ))}
            <div className="flex gap-x-4 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:outline-none flex flex-row items-center gap-x-2 font-bold">
                  <Image
                    src={"/images/categories/categories.png"}
                    alt={"icon des catégories"}
                    className="w-[42px] h-[42px]"
                    width={42}
                    height={42}
                  />
                  <span>Catégories</span>
                  <FaChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-auto bg-white px-2"
                  align="end">
                  {categories?.slice(7).map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      className="gap-x-3">
                      <Link href={"/category/" + category.id}>
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavCategories;
