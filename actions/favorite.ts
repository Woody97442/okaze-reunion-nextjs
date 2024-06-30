"use server";

import { prisma } from "@/prisma/prismaClient";
import { getPostById } from "@/data/post";
import { getFavoriteByUserId } from "@/data/favorite";
import { auth } from "@/auth";

export const updateFavorite = async (postId: string) => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingPost = await getPostById(postId);

    if (!existingPost) {
        return { error: "post introuvable !" };
    }

    const existingFavorite = await getFavoriteByUserId(userId);

    if (!existingFavorite) {

        await prisma.favorite.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                posts: {
                    connect: {
                        id: postId
                    }
                }
            }
        });

        return { success: "Post ajouter au favoris !" };
    }

    const postAlreadyFavorited = existingFavorite.posts.some(post => post.id === postId);

    if (postAlreadyFavorited) {
        await prisma.favorite.update({
            where: { userId: userId },
            data: {
                posts: {
                    disconnect: { id: postId }
                }
            }
        });

        return { success: "Post retiré des favoris." };
    } else {
        await prisma.favorite.update({
            where: { userId: userId },
            data: {
                posts: {
                    connect: { id: postId }
                }
            }
        });

        return { success: "Post ajouté aux favoris !" };
    }

}
