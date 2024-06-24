import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/nav/navbar";
import NavbarAuthenticated from "@/components/nav/navbar-authenticated";
import NavCategories from "@/components/nav/nav-categories";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Okaze Réunion",
  description: "Brocantage de la Réunion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html
        lang="fr"
        className="!h-auto">
        <body className={inter.className + " bg-[#f5f5f5]"}>
          <div className="sticky top-0 z-50">
            {!session?.user ? <Navbar /> : <NavbarAuthenticated />}
            <NavCategories />
          </div>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
