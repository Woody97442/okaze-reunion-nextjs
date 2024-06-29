"use client";
import { SearchBar } from "@/components/nav/client/searchbar";
import { TabButton } from "@/components/nav/client/tab-button";

import Link from "next/link";
import { LoginButton } from "@/components/auth/client/login-button";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <nav className="bg-white w-full">
          <div className=" flex justify-between items-center py-4 mx-[250px]">
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
        <nav className="bg-white w-full">
          <div className=" flex justify-between items-center py-4 mx-[250px]">
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
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
