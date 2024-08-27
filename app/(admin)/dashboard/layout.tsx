import { GetAllAttributes } from "@/actions/admin/attributes";
import { GetAllCategories } from "@/actions/admin/categories";
import { GetAllMessages } from "@/actions/admin/messages";
import { GetAllPosts } from "@/actions/admin/post";
import { GetAllUsers } from "@/actions/admin/user";
import { auth } from "@/auth";
import AdminContextProvider from "@/components/context/admin-context";
import LoaderOkaze from "@/components/utils/loader";
import { Attribut } from "@/prisma/attribut/types";
import { Category } from "@/prisma/category/types";
import { Message } from "@/prisma/message/types";
import { Post } from "@/prisma/post/types";
import { User } from "@/prisma/user/types";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const dataPost = await GetAllPosts();
  const dataUser = await GetAllUsers();
  const dataCategory = await GetAllCategories();
  const dataAttribut = await GetAllAttributes();
  const dataMessages = await GetAllMessages();

  return (
    <AdminContextProvider
      dataUsers={dataUser as User[]}
      dataPosts={dataPost as Post[]}
      dataMessages={dataMessages as Message[]}
      dataCategory={dataCategory as Category[]}
      dataAttributes={dataAttribut as Attribut[]}>
      {children}
    </AdminContextProvider>
  );
}
