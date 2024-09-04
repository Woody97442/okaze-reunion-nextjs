"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";

export const createLot = async (name: string, postId: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }


    const newLot = await prisma.lot.create({
        data: {
            name: name,
            user: {
                connect: {
                    id: userId,
                },
            },
            posts: {
                connect: {
                    id: postId,
                },
            },
        },
        include: {
            posts: {
                include: {
                    images: true,
                },
            },
        }
    });

    return { lot: newLot, success: "Nouveau lot creé !" };

}

export const addToLot = async (lotId: string, postId: string) => {
    const session = await auth();
    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingLot = await prisma.lot.findUnique({
        where: {
            id: lotId,
        },
    });

    if (!existingLot) {
        return { error: "lot introuvable !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    const postExistInLot = await prisma.lot.findUnique({
        where: {
            id: lotId,
        },
        include: {
            posts: true,
        },
    });

    if (postExistInLot?.posts.some((post) => post.id === postId)) {
        return { error: "Annonce deja dans le lot !" };
    }

    const updatedLot = await prisma.lot.update({
        where: {
            id: lotId,
        },
        data: {
            posts: {
                connect: {
                    id: postId,
                },
            },
        },
        include: {
            posts: {
                include: {
                    images: true,
                },
            },
        },
    });

    return { lot: updatedLot, success: "Ajout au lot !" };

}

export const deleteLot = async (lotId: string) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingLot = await prisma.lot.findUnique({
        where: {
            id: lotId,
        },
        include: {
            message: true
        }
    });

    if (!existingLot) {
        return { error: "lot introuvable !" };
    }

    if (existingLot.message) {
        await prisma.message.update({
            where: {
                id: existingLot.message?.id
            },
            data: {
                lot: {
                    disconnect: true
                },
                isArchived: true
            }
        })
    }

    await prisma.lot.delete({
        where: {
            id: lotId,
        },
    });

    return { success: "lot supprimé !" };
}

export const deletePostInLot = async (postId: string, lotId: string) => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingLot = await prisma.lot.findUnique({
        where: {
            id: lotId,
        },
    });

    if (!existingLot) {
        return { error: "lot introuvable !" };
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!existingPost) {
        return { error: "Annonce introuvable !" };
    }

    const updatedLot = await prisma.lot.update({
        where: {
            id: lotId,
        },
        data: {
            posts: {
                disconnect: {
                    id: postId,
                },
            },
        },
        include: {
            posts: {
                include: {
                    images: true,
                    categories: true,
                    attributs: true,
                    favorites: true
                }
            },
        },
    });

    const lotIsEmpty = updatedLot.posts.length === 0 || !updatedLot.posts;

    if (lotIsEmpty) {
        await prisma.lot.delete({
            where: {
                id: lotId,
            },
        });
        return { delete: true, lot: null, success: "lot vide supprimé !" };
    }

    return { delete: false, lot: updatedLot, success: "Annonce supprimé !" };

}