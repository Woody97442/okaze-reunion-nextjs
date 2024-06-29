"use client";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { FaUserGear } from "react-icons/fa6";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/client/logout-button";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar className="h-[55px] w-[55px]">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-[#2D8653]">
            <FaUser className="text-white w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        {user?.name || ""}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto bg-white px-2"
        align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="mr-2 h-4 w-4" />
            Se deconnecter
          </DropdownMenuItem>
        </LogoutButton>
        <DropdownMenuItem>
          <FaUserGear className="mr-2 h-4 w-4" />
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
