"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BsBoxSeam, BsHeart } from "react-icons/bs";
import { FiMail } from "react-icons/fi";

export const TabButton = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex">
        <Button
          variant={pathname === "/favorites" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/favorites"
            className="flex flex-col items-center gap-y-1">
            <BsHeart className="w-6 h-6" />
            <span>Favoris</span>
          </Link>
        </Button>
      </div>
      <div className="flex">
        <Button
          variant={pathname === "/my-lots" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/my-lots"
            className="flex flex-col items-center gap-y-1">
            <BsBoxSeam className="w-6 h-6" />
            <span>Mes Lots</span>
          </Link>
        </Button>
      </div>
      <div className="flex">
        <Button
          variant={pathname === "/messages" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/messages"
            className="flex flex-col items-center gap-y-1">
            <FiMail className="w-6 h-6" />
            <span>Messages</span>
          </Link>
        </Button>
      </div>
    </>
  );
};
