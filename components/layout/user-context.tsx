"use client";

import { User, UserFavorite, UserLots } from "@/prisma/user/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

// Définir le type pour le contexte utilisateur
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  currentUserFavorite: UserFavorite | null;
  setCurrentUserFavorite: Dispatch<SetStateAction<UserFavorite | null>>;
  currentUserLots: UserLots | null;
  setCurrentUserLots: Dispatch<SetStateAction<UserLots | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  const [currentUserFavorite, setCurrentUserFavorite] =
    useState<UserFavorite | null>(
      currentUser
        ? { id: currentUser.id, favorite: currentUser.favorite }
        : null
    );

  const [currentUserLots, setCurrentUserLots] = useState<UserLots | null>(
    currentUser ? { id: currentUser.id, lot: currentUser.lot } : null
  );

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserFavorite,
        setCurrentUserFavorite,
        currentUserLots,
        setCurrentUserLots,
      }}>
      {children}
    </UserContext.Provider>
  );
}
