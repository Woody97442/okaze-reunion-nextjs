"use client";
import { SearchBar } from "@/components/layout/nav/searchbar";
import { TabButton } from "@/components/layout/nav/tab-button";

import Link from "next/link";
import { LoginButton } from "@/components/auth/client/login-button";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import { User } from "@/prisma/user/types";
import { UserButton } from "@/components/auth/client/user-button";
import NavCategories from "./nav/nav-categories";
import { NavCategory } from "@/prisma/category/types";

const Navbar = ({
  user,
  categories,
}: {
  user: User;
  categories: NavCategory[];
}) => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <nav className="bg-white w-full shadow-lg">
          <div className=" flex justify-between items-center py-4 container">
            <Button
              variant="default"
              asChild>
              <Link
                href="/"
                className=" gap-x-2">
                <FaArrowLeft className="w-4 h-4 font-Lato" />
                Retour
              </Link>
            </Button>
            <div className="flex gap-x-4 items-center">
              <TabButton pathname={pathname} />
              <Link
                aria-label="logo de l'application Okaze Réunion"
                href="/">
                <Image
                  src="/images/logo/okaze-logo.png"
                  alt="logo de l'application Okaze Réunion"
                  className="w-full h-[90px]"
                  width={200}
                  height={90}
                />
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-white w-full ">
          <div className=" flex justify-between items-center py-4 container">
            <div className="w-auto">
              <Link
                aria-label="logo de l'application Okaze Réunion"
                href="/">
                <Image
                  src="/images/logo/okaze-logo.png"
                  alt="logo de l'application Okaze Réunion"
                  className="w-full h-[90px]"
                  width={200}
                  height={90}
                />
              </Link>
            </div>
            <SearchBar />
            <div className="flex gap-x-4 items-center">
              <TabButton pathname={pathname} />
              {user ? (
                <UserButton user={user} />
              ) : (
                <LoginButton>
                  <Link
                    href="/auth/login"
                    className="flex flex-col items-center gap-y-1">
                    <FaUser className="text-black w-6 h-6" />
                    <span className="font-Lato">Se connecter</span>
                  </Link>
                </LoginButton>
              )}
            </div>
          </div>
        </nav>
      )}
      <NavCategories
        categories={categories}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;
