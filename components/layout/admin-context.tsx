"use client";

import { Category } from "@/prisma/category/types";
import { Post } from "@/prisma/post/types";
import { User } from "@/prisma/user/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

// Définir le type pour le contexte utilisateur
interface AdminContextType {
  allUsers: User[] | null;
  setAllUsers: Dispatch<SetStateAction<User[] | null>>;
  allPosts: Post[] | null;
  setAllPosts: Dispatch<SetStateAction<Post[] | null>>;
  allCategories: Category[] | null;
  setAllCategories: Dispatch<SetStateAction<Category[] | null>>;
  currentContent: string;
  setCurrentContent: Dispatch<SetStateAction<string>>;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminContextProvider({
  children,
  dataPosts,
  dataUsers,
  dataCategory,
}: {
  children: React.ReactNode;
  dataPosts: Post[];
  dataUsers: User[];
  dataCategory: Category[];
}) {
  const [allUsers, setAllUsers] = useState<User[] | null>(dataUsers);
  const [allPosts, setAllPosts] = useState<Post[] | null>(dataPosts);
  const [allCategories, setAllCategories] = useState<Category[] | null>(
    dataCategory
  );
  const [currentContent, setCurrentContent] = useState("posts");

  return (
    <AdminContext.Provider
      value={{
        allUsers,
        setAllUsers,
        allPosts,
        setAllPosts,
        allCategories,
        setAllCategories,
        currentContent,
        setCurrentContent,
      }}>
      {children}
    </AdminContext.Provider>
  );
}
