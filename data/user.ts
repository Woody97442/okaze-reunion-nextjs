import { prisma } from "@/prisma/prismaClient";
import { User } from "@/prisma/user/types";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                Account: true,
                favorite: true,
                lot: true,
                messages: true
            }
        })
        return user
    } catch {
        return null
    }
}

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                Account: true,
                favorite: {
                    include: {
                        posts: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                lot: {
                    include: {
                        posts: {
                            include: {
                                images: true
                            }
                        }
                    },
                },
                messages: true
            }
        })
        return user as User
    } catch {
        return null
    }
}