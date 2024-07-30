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

export const CreatePost = async (formData: FormData, categories: Category[], attributes?: Attribut[]) => {

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const state = formData.get("state") as string;

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
                    connect: categories.map((category) => ({
                        id: category.id
                    }))
                },
                attributs: {
                    connect: attributes?.map((attribute) => ({
                        id: attribute.id
                    }))
                }
            }
        });

        return { post: newPost, success: "Post cree avec succes" };
    } catch (error) {
        console.log(error);
        return { error: "Une erreur est survenue !" };
    }

}
