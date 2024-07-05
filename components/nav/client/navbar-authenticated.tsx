import { auth } from "@/auth";
import { UserButton } from "@/components/auth/client/user-button";
import { SearchBar } from "@/components/nav/client/searchbar";
import { TabButton } from "@/components/nav/client/tab-button";
import { getUserById } from "@/data/user";

import Link from "next/link";

const NavbarAuthenticated = async () => {
  const session = await auth();
  if (!session) return <div></div>;

  const user = await getUserById(session.user.id as string);

  return (
    <nav className="bg-white w-full">
      <div className=" flex justify-between items-center py-4 container">
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
          <UserButton user={user} />
        </div>
      </div>
    </nav>
  );
};

export default NavbarAuthenticated;
