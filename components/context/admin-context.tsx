"use client";

import { Attribut } from "@/prisma/attribut/types";
import { Category } from "@/prisma/category/types";
import { Message } from "@/prisma/message/types";
import { Post } from "@/prisma/post/types";
import { User } from "@/prisma/user/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

// Définir le type pour le contexte utilisateur
interface AdminContextType {
  allUsers: User[] | null;
  setAllUsers: Dispatch<SetStateAction<User[] | null>>;
  allPosts: Post[] | null;
  setAllPosts: Dispatch<SetStateAction<Post[] | null>>;
  allMessages: Message[] | null;
  setAllMessages: Dispatch<SetStateAction<Message[] | null>>;
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
  currentCategory: Category | null;
  setCurrentCategory: Dispatch<SetStateAction<Category | null>>;
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
  dataUsers,
  dataPosts,
  dataMessages,
  dataCategory,
  dataAttributes,
}: {
  children: React.ReactNode;
  dataUsers: User[];
  dataPosts: Post[];
  dataMessages: Message[];
  dataCategory: Category[];
  dataAttributes: Attribut[];
}) {
  const [allUsers, setAllUsers] = useState<User[] | null>(dataUsers);
  const [allPosts, setAllPosts] = useState<Post[] | null>(dataPosts);
  const [allMessages, setAllMessages] = useState<Message[] | null>(
    dataMessages
  );
  const [allCategories, setAllCategories] = useState<Category[] | null>(
    dataCategory
  );
  const [allAttributes, setAllAttributes] = useState<Attribut[] | null>(
    dataAttributes
  );

  const [tempUploadFiles, setTempUploadFiles] = useState<PropsImagesPost[]>([]);
  const [currentContent, setCurrentContent] = useState("posts");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AdminContext.Provider
      value={{
        allUsers,
        setAllUsers,
        allPosts,
        setAllPosts,
        allMessages,
        setAllMessages,
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
        currentCategory,
        setCurrentCategory,
        loading,
        setLoading,
      }}>
      {children}
    </AdminContext.Provider>
  );
}
