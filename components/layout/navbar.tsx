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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HiMenuAlt2 } from "react-icons/hi";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { LogoutButton } from "../auth/client/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useState } from "react";
const Navbar = ({
  user,
  categories,
  numberOfUnreadMessages,
}: {
  user: User;
  categories: NavCategory[];
  numberOfUnreadMessages: string;
}) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed shadow-lg z-50 bg-white w-full">
      {pathname === "/auth/login" || pathname === "/auth/register" ? (
        <nav className="bg-white w-full shadow-lg">
          <div className=" justify-between items-center py-4 container hidden md:flex">
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
              <TabButton
                pathname={pathname}
                user={user}
                numberOfUnreadMessagesAdmin={numberOfUnreadMessages}
              />
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
          <div className=" flex flex-col justify-between items-center gap-6 py-4 container md:hidden">
            <div className="w-full flex justify-between flex-row items-center">
              <Button
                variant="default"
                asChild
                className="py-6 px-6">
                <Link
                  href="/"
                  className=" gap-x-2">
                  <FaArrowLeft className="w-6 h-6 font-Lato" />
                </Link>
              </Button>
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
            <div className="flex gap-x-4 items-center justify-between w-full">
              <TabButton
                pathname={pathname}
                user={user}
                numberOfUnreadMessagesAdmin={numberOfUnreadMessages}
              />
            </div>
          </div>
        </nav>
      ) : (
        <>
          <nav className="bg-white w-full">
            <div className="justify-between items-center py-4 container flex gap-6 flex-col md:flex-row">
              <div className="w-full flex justify-between items-center">
                <div className="grid grid-cols-2 gap-2 md:hidden">
                  <Sheet
                    key="left"
                    onOpenChange={setMenuOpen}
                    open={menuOpen}>
                    <SheetTrigger asChild>
                      <div className="bg-secondary rounded-full p-2 w-fit h-fit">
                        <HiMenuAlt2 className="w-6 h-6 text-white" />
                      </div>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-auto overflow-y-scroll">
                      <SheetHeader>
                        <SheetTitle className="font-Lato mb-4">
                          <div>
                            <span>Menu</span>
                            <Separator />
                          </div>
                        </SheetTitle>
                      </SheetHeader>

                      {user ? (
                        <div className="flex flex-col gap-y-6">
                          <div className="flex py-2 justify-center w-full bg-secondary rounded-md text-white">
                            <Link href="/profile">Profile</Link>
                          </div>
                          <div className="flex py-2 justify-center w-full bg-primary rounded-md text-white">
                            <LogoutButton>
                              <div className="flex items-center">
                                <ExitIcon className="mr-2 h-6 w-6" />
                                Se deconnecter
                              </div>
                            </LogoutButton>
                          </div>
                        </div>
                      ) : (
                        <LoginButton>
                          <Link
                            href="/auth/login"
                            className="flex flex-col text-white items-center gap-y-1 bg-secondary px-4 py-4 rounded-full md:p-0 md:rounded-none md:bg-transparent md:text-black">
                            <FaUser className="w-6 h-6 " />
                            <span className="font-Lato ">Se connecter</span>
                          </Link>
                        </LoginButton>
                      )}
                      <SheetHeader>
                        <SheetTitle className="font-Lato my-4">
                          <div>
                            <span>Catégories</span>
                            <Separator />
                          </div>
                        </SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-screen w-full rounded-md ">
                        <div className="p-4">
                          <div className="flex flex-col gap-y-6 items-center py-4 ">
                            {categories.map((category) => (
                              <div
                                className="flex w-full px-4 shadow-lg rounded-sm"
                                key={category.id}>
                                <Button
                                  variant={"ghost"}
                                  className="h-full"
                                  onClick={() => {
                                    setMenuOpen(false);
                                  }}>
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
                                    <span className="font-Lato">
                                      {category.name.slice(0, 1).toUpperCase() +
                                        category.name.slice(1).toLowerCase()}
                                    </span>
                                  </Link>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
                <Link
                  aria-label="logo de l'application Okaze Réunion"
                  href="/">
                  <Image
                    src="/images/logo/okaze-logo.png"
                    alt="logo de l'application Okaze Réunion"
                    className="w-full h-[100px] md:h-[90px]"
                    width={200}
                    height={90}
                  />
                </Link>
              </div>
              <SearchBar />
              <div className="flex gap-x-4 items-center">
                <TabButton
                  pathname={pathname}
                  user={user}
                  numberOfUnreadMessagesAdmin={numberOfUnreadMessages}
                />
                {user ? (
                  <div className="hidden md:block">
                    <UserButton user={user} />
                  </div>
                ) : (
                  <LoginButton>
                    <Link
                      href="/auth/login"
                      className="flex flex-col text-white items-center gap-y-1 bg-secondary px-4 py-4 rounded-full md:p-0 md:rounded-none md:bg-transparent md:text-black">
                      <FaUser className="w-6 h-6 " />
                      <span className="font-Lato text-nowrap hidden md:block">
                        Se connecter
                      </span>
                    </Link>
                  </LoginButton>
                )}
              </div>
            </div>
          </nav>
        </>
      )}
      <div className="hidden md:block">
        <NavCategories
          categories={categories}
          pathname={pathname}
        />
      </div>
    </div>
  );
};

export default Navbar;
