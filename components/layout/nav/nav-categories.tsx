import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa6";
import { NavCategory } from "@/prisma/category/types";

const NavCategories = ({
  categories,
  pathname,
}: {
  categories: NavCategory[];
  pathname: string;
}) => {
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
                    href={"/category/" + category.name}
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
                    <span className="font-Lato">
                      {category.name.slice(0, 1).toUpperCase() +
                        category.name.slice(1).toLowerCase()}
                    </span>
                  </Link>
                </Button>
              </div>
            ))}
            {categories.length > 7 && (
              <div className="flex gap-x-4 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus-visible:outline-none flex flex-row items-center gap-x-2 font-bold">
                    <Image
                      src={"/images/categories.png"}
                      alt={"icon des catégories"}
                      className="w-[42px] h-[42px]"
                      width={42}
                      height={42}
                    />
                    <span className="font-Lato">Catégories</span>
                    <FaChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-auto bg-white px-2"
                    align="end">
                    {categories?.slice(7).map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        className="gap-x-3">
                        <Link
                          href={"/category/" + category.name}
                          className="font-Lato">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavCategories;
