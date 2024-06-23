"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@prisma/client";

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";

export const AllCategoriesButton = ({
  categories,
}: {
  categories?: Category[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none flex flex-row items-center gap-x-2 font-bold">
        <img
          src={"/images/categories/categories.png"}
          alt={"icon des catégories"}
          className="w-[42px] h-[42px]"
        />
        <span>Catégories</span>
        <FaChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto bg-white px-2"
        align="end">
        {categories?.map((category) => (
          <DropdownMenuItem
            key={category.id}
            className="gap-x-3">
            <img
              src={category.icon}
              alt={"icon des catégories"}
              className="w-[24px] h-[24px]"
            />
            <Link href={"/category?id=" + category.id}>{category.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
