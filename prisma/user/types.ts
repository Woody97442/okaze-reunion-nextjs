import { $Enums, Account } from "@prisma/client";
import { Favorite } from "@/prisma/favorite/types";
import { Lot } from "@/prisma/lot/types";
import { Message } from "../message/types";

export type User = {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    image: string | null;
    gender: String | null;
    postalCode: String | null;
    phoneNumber: String | null;
    role: $Enums.UserRole;
    isTwoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
    favorite: Favorite | null;
    lot: Lot[];
    Account: Account | null;
} | null

export type UserFavorite = {
    id: string;
    favorite: Favorite | null;
} | null

export type UserLots = {
    id: string;
    lot: Lot[];
} | null