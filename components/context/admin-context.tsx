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
  allCategories: Category[] | null;
  setAllCategories: Dispatch<SetStateAction<Category[] | null>>;
  allAttributes: Attribut[] | null;
  setAllAttributes: Dispatch<SetStateAction<Attribut[] | null>>;
  tempUploadFiles: PropsImagesPost[];
  setTempUploadFiles: Dispatch<SetStateAction<PropsImagesPost[]>>;
  currentContent: string;
  setCurrentContent: Dispatch<SetStateAction<string>>;
  currentPost: Post | null;
  setCurrentPost: Dispatch<SetStateAction<Post | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface PropsImagesPost {
  file: File;
  fileUrl: string;
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

  const [tempUploadFiles, setTempUploadFiles] = useState<PropsImagesPost[]>([]);
  const [currentContent, setCurrentContent] = useState("posts");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AdminContext.Provider
      value={{
        allUsers,
        setAllUsers,
        allPosts,
        setAllPosts,
        allCategories,
        setAllCategories,
        allAttributes,
        setAllAttributes,
        currentContent,
        setCurrentContent,
        tempUploadFiles,
        setTempUploadFiles,
        currentPost,
        setCurrentPost,
        loading,
        setLoading,
      }}>
      {children}
    </AdminContext.Provider>
  );
}
