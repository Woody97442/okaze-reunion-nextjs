import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/nav/navbar";

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
      <html lang="fr">
        <body className={inter.className}>
          {!session?.user && <Navbar />}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
