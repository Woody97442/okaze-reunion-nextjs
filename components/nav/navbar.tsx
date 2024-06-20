"use client";
import { SearchBar } from "@/components/nav/searchbar";
import { TabButton } from "@/components/nav/tab-button";

import Link from "next/link";
import { LoginButton } from "../auth/login-button";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <nav className="bg-white flex justify-between items-center  w-full py-4 px-12">
          <Button
            variant="default"
            asChild>
            <Link
              href="/"
              className=" gap-x-2">
              <FaArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </Button>
          <div className="flex gap-x-4 items-center">
            <TabButton />
            <Link
              aria-label="logo de l'application Okaze Réunion"
              href="/">
              <img
                src="/images/okaze-logo.png"
                alt="logo de l'application Okaze Réunion"
                className="w-full h-[90px]"
              />
            </Link>
          </div>
        </nav>
      ) : (
        <nav className="bg-white flex justify-between items-center  w-full py-4 px-12">
          <div className="w-auto">
            <Link
              aria-label="logo de l'application Okaze Réunion"
              href="/">
              <img
                src="/images/okaze-logo.png"
                alt="logo de l'application Okaze Réunion"
                className="w-full h-[90px]"
              />
            </Link>
          </div>
          <SearchBar />
          <div className="flex gap-x-4 items-center">
            <TabButton />
            <LoginButton>
              <Link
                href="/auth/login"
                className="flex flex-col items-center gap-y-1">
                <FaUser className="text-black w-6 h-6" />
                <span>Se connecter</span>
              </Link>
            </LoginButton>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
