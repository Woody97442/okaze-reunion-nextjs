"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Post } from "@/prisma/post/types";

export const GetAllPosts = async () => {

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const posts = await prisma.post.findMany({
        include: {
            categories: true,
            attributs: true,
            images: true,
            favorites: true
        }
    });

    return posts as Post[];
}
