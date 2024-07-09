import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BsBoxSeam, BsHeart } from "react-icons/bs";
import { FiMail } from "react-icons/fi";

export const TabButton = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <div className="flex">
        <Button
          variant={pathname === "/favorites" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/favorites"
            className={`flex flex-col items-center gap-y-1 ${
              pathname === "/favorites" ? "text-white font-bold" : ""
            }`}>
            <BsHeart className="w-6 h-6" />
            <span className="font-Lato">Favoris</span>
          </Link>
        </Button>
      </div>
      <div className="flex">
        <Button
          variant={pathname === "/my-lots" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/my-lots"
            className={`flex flex-col items-center gap-y-1 ${
              pathname === "/my-lots" ? "text-white font-bold" : ""
            }`}>
            <BsBoxSeam className="w-6 h-6" />
            <span className="font-Lato">Mes Lots</span>
          </Link>
        </Button>
      </div>
      <div className="flex">
        <Button
          variant={pathname === "/messages" ? "secondary" : "ghost"}
          className="h-full">
          <Link
            href="/messages"
            className={`flex flex-col items-center gap-y-1 ${
              pathname === "/messages" ? "text-white font-bold" : ""
            }`}>
            <FiMail className="w-6 h-6" />
            <span className="font-Lato">Messages</span>
          </Link>
        </Button>
      </div>
    </>
  );
};
