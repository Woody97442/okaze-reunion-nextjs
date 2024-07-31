"use client";

import { Attribut } from "@/prisma/attribut/types";
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
  newPost: Post | null;
  setNewPost: Dispatch<SetStateAction<Post | null>>;
  allCategories: Category[] | null;
  setAllCategories: Dispatch<SetStateAction<Category[] | null>>;
  currentContent: string;
  setCurrentContent: Dispatch<SetStateAction<string>>;
  allAttributes: Attribut[] | null;
  setAllAttributes: Dispatch<SetStateAction<Attribut[] | null>>;
  currentPostEdit: Post | null;
  setCurrentPostEdit: Dispatch<SetStateAction<Post | null>>;
  currentCategoriesForPost: Category[];
  setCurrentCategoriesForPost: Dispatch<SetStateAction<Category[]>>;
  currentAttributsForPost: Attribut[];
  setCurrentAttributsForPost: Dispatch<SetStateAction<Attribut[]>>;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminContextProvider({
  children,
  dataPosts,
  dataUsers,
  dataCategory,
  dataAttributes,
}: {
  children: React.ReactNode;
  dataPosts: Post[];
  dataUsers: User[];
  dataCategory: Category[];
  dataAttributes: Attribut[];
}) {
  const [allUsers, setAllUsers] = useState<User[] | null>(dataUsers);
  const [allPosts, setAllPosts] = useState<Post[] | null>(dataPosts);
  const [allCategories, setAllCategories] = useState<Category[] | null>(
    dataCategory
  );
  const [allAttributes, setAllAttributes] = useState<Attribut[] | null>(
    dataAttributes
  );
  const [currentContent, setCurrentContent] = useState("posts");

  const [currentPostEdit, setCurrentPostEdit] = useState<Post | null>(null);

  const [currentCategoriesForPost, setCurrentCategoriesForPost] = useState<
    Category[]
  >([]);

  const [currentAttributsForPost, setCurrentAttributsForPost] = useState<
    Attribut[]
  >([]);

  const [newPost, setNewPost] = useState<Post | null>(null);

  return (
    <AdminContext.Provider
      value={{
        allUsers,
        setAllUsers,
        newPost,
        setNewPost,
        allPosts,
        setAllPosts,
        allCategories,
        setAllCategories,
        currentContent,
        setCurrentContent,
        allAttributes,
        setAllAttributes,
        currentPostEdit,
        setCurrentPostEdit,
        currentCategoriesForPost,
        setCurrentCategoriesForPost,
        currentAttributsForPost,
        setCurrentAttributsForPost,
      }}>
      {children}
    </AdminContext.Provider>
  );
}
