"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex justify-between items-center  w-[90%] p-4 rounded-xl shadow-sm">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/profile" ? "default" : "outline"}>
          <Link href="/profile">Profile</Link>
        </Button>
      </div>
      <p>User Button</p>
    </nav>
  );
};

export default Navbar;
