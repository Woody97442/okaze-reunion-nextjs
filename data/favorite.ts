import { auth } from "@/auth";
import { Favorite } from "@/prisma/favorite/types";
import { prisma } from "@/prisma/prismaClient";

// Retourne les favoris d'un utilisateur
export const getFavoriteByUserId = async (userId: string): Promise<Favorite | null> => {
    try {
        const favoris = await prisma.favorite.findUnique({
            where: {
                userId
            }, include: {
                posts: {
                    include: {
                        images: true
                    }

                }
            }
        })
        return favoris
    } catch {
        return null
    }
}

// retourne true ou false si le post est dans les favoris d'un utilisateur
export const isFavorite = async (postId: string): Promise<boolean> => {
    const session = await auth();

    if (!session) {
        return false;
    }

    const userId = session.user.id;

    if (!userId) {
        return false;
    }
    try {
        const favoris = await prisma.favorite.findMany({
            where: {
                userId,
                posts: {
                    some: {
                        id: postId
                    }
                }
            }
        })
        return favoris.length > 0
    } catch {
        return false
    }
}