"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild = false,
}: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  };

  return (
    <span
      onClick={onClick}
      className="cursor-pointer p-2 hover:bg-gray-100 rounded active:bg-gray-300 active:scale-95 transition-all">
      {children}
    </span>
  );
};
