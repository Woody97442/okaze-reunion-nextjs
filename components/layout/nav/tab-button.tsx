import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LiaUserShieldSolid } from "react-icons/lia";
import { BsBoxSeam, BsHeart } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { User } from "@/prisma/user/types";

export const TabButton = ({
  pathname,
  user,
  numberOfUnreadMessagesAdmin,
}: {
  pathname: string;
  user: User;
  numberOfUnreadMessagesAdmin: string;
}) => {
  const userRole = user?.role;
  const unreadMessagesCount = user?.messages.filter(
    (message) => message.isReadByUser === false
  ).length;

  return (
    <>
      {userRole === "ADMIN" && (
        <div className="flex">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="h-full">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center gap-y-1 ${
                pathname === "/dashboard" ? "text-white font-bold" : ""
              }`}>
              <LiaUserShieldSolid className="w-7 h-7" />
              <span className="font-Lato">Administration</span>
            </Link>
          </Button>
        </div>
      )}
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
          variant={
            pathname === "/messages" || pathname === "/dashboard/admin-messages"
              ? "ghost"
              : "ghost"
          }
          className="h-full">
          <Link
            href={
              userRole === "ADMIN" ? "/dashboard/admin-messages" : "/messages"
            }
            className={`flex flex-col items-center gap-y-1 ${
              pathname === "/messages" ||
              pathname === "/dashboard/admin-messages"
                ? "font-bold"
                : ""
            }`}>
            <div className="relative">
              <FiMail className="w-6 h-6" />
              {unreadMessagesCount && unreadMessagesCount > 0 ? (
                <span className="absolute -top-4 -right-4 text-xs bg-secondary w-auto h-auto py-1 px-2 rounded-full flex items-center justify-center text-white">
                  {unreadMessagesCount}
                </span>
              ) : null}
              {numberOfUnreadMessagesAdmin &&
              parseInt(numberOfUnreadMessagesAdmin) > 0 &&
              userRole === "ADMIN" ? (
                <span className="absolute -top-4 -right-4 text-xs bg-secondary w-auto h-auto py-1 px-2 rounded-full flex items-center justify-center text-white">
                  {numberOfUnreadMessagesAdmin}
                </span>
              ) : null}
            </div>
            <span className="font-Lato">Messages</span>
          </Link>
        </Button>
      </div>
    </>
  );
};
