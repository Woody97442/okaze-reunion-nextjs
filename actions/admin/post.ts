"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Post } from "@/prisma/post/types";
import { Attribut } from "@/prisma/attribut/types";
import { Category } from "@/prisma/category/types";
import { $Enums } from "@prisma/client";
import generateIcode from "@/lib/token";

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

export const CreatePost = async (post: Post) => {

    const title = post.title;
    const description = post.description;
    const price = post.price;
    const state = post.state;

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

    const icode = await generateIcode();

    try {
        const newPost = await prisma.post.create({
            data: {
                icode,
                title,
                price: Number(price),
                description,
                state: state as $Enums.PostState,
                categories: {
                    connect: post.categories.map((category) => ({
                        id: category.id
                    }))
                },
                attributs: {
                    connect: post.attributs?.map((attribute) => ({
                        id: attribute.id
                    }))
                }
            }
        });

        return { post: newPost, success: "Post créé avec succes" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}


export const UpdatePost = async (updateCurrentPost: Post) => {

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

    const existingPost = await prisma.post.findUnique({
        where: {
            id: updateCurrentPost.id
        },
        include: {
            categories: true,
            attributs: true,
            images: true
        }
    });

    if (!existingPost) {
        return { error: "Post introuvable !" };
    }

    // Extraire les IDs des catégories et attributs existants
    const existingCategoryIds = existingPost.categories.map(category => category.id);
    const existingAttributeIds = existingPost.attributs.map(attribute => attribute.id);

    // Extraire les IDs des nouvelles catégories et attributs à partir des données mises à jour
    const newCategoryIds = updateCurrentPost.categories.map(category => category.id);
    const newAttributeIds = updateCurrentPost.attributs.map(attribute => attribute.id);

    // Déterminer les IDs à connecter (ajouter)
    const categoriesToConnect = newCategoryIds.filter(id => !existingCategoryIds.includes(id));
    const attributsToConnect = newAttributeIds.filter(id => !existingAttributeIds.includes(id));

    // Déterminer les IDs à déconnecter (retirer)
    const categoriesToDisconnect = existingCategoryIds.filter(id => !newCategoryIds.includes(id));
    const attributsToDisconnect = existingAttributeIds.filter(id => !newAttributeIds.includes(id));


    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: updateCurrentPost.id
            },
            data: {
                title: updateCurrentPost.title,
                description: updateCurrentPost.description,
                price: Number(updateCurrentPost.price),
                state: updateCurrentPost.state as $Enums.PostState,
                // Gérer les catégories
                categories: {
                    connect: categoriesToConnect.map(id => ({ id })),
                    disconnect: categoriesToDisconnect.map(id => ({ id })),
                },

                // Gérer les attributs
                attributs: {
                    connect: attributsToConnect.map(id => ({ id })),
                    disconnect: attributsToDisconnect.map(id => ({ id })),
                }
            },
            include: {
                categories: true,
                attributs: true,
                images: true
            }
        });

        return { post: updatedPost, success: "Post mise a jour avec succes" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}