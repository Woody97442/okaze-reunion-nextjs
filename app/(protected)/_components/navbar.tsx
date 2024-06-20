"use client";
import { UserButton } from "@/components/auth/user-button";
import { SearchBar } from "@/components/nav/searchbar";
import { TabButton } from "@/components/nav/tab-button";
import { useCurrentUser } from "@/hooks/use-current-user";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white flex justify-between items-center  w-full py-4 px-12">
      <div className="w-auto">
        <Link
          aria-label="logo de l'application Okaze Réunion"
          href="/">
          <img
            src="/images/logo/okaze-logo.png"
            alt="logo de l'application Okaze Réunion"
            className="w-full h-[90px]"
          />
        </Link>
      </div>
      <SearchBar />
      <div className="flex gap-x-4 items-center">
        <TabButton />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
