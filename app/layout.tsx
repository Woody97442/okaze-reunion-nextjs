import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { getUserById } from "@/data/user";
import UserContextProvider from "@/components/context/user-context";

const inter = Montserrat({ subsets: ["latin"] });

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

  const user = await getUserById(session?.user.id as string);

  return (
    <SessionProvider session={session}>
      <html
        lang="fr"
        className="!h-auto">
        <body
          className={
            inter.className +
            " bg-[#f5f5f5] flex flex-col justify-between min-h-screen"
          }>
          <UserContextProvider user={user}>
            <Header />
            {children}
            <Footer />
          </UserContextProvider>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
