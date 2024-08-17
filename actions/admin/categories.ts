"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Category } from "@/prisma/category/types";

export const GetAllCategories = async () => {

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

    const categories = await prisma.category.findMany({
        include: {
            posts: {
                include: {
                    images: true,
                }
            }
        }
    });

    return categories as Category[];
}

export const CreateCategory = async (name: string, icon?: string) => {
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

    if (typeof name !== "string") {
        return { error: "Le nom de la catégorie doit être une chaine de caractères !" };
    }

    const formattedName = name.trim();
    if (formattedName.length === 0) {
        return { error: "Le nom de la catégorie ne doit pas être vide !" };
    }

    if (formattedName.length > 20) {
        return { error: "Le nom de la catégorie ne doit pas dépasser 20 caractères !" };
    }

    const existingCategory = await prisma.category.findUnique({
        where: {
            name: formattedName
        }
    });

    if (existingCategory) {
        return { error: "La catégorie existe déja !" };
    }

    if (icon) {
        try {
            const newCategory = await prisma.category.create({
                data: {
                    name: formattedName,
                    icon: icon,
                    altIcon: "Icone de la catégorie " + formattedName,
                }
            });
            return { category: newCategory as Category, success: "Catégorie créée !" };

        } catch (error) {
            return { error: "Une erreur est survenue pendant la creation de la catégorie !" };
        }

    } else {
        try {
            const newCategory = await prisma.category.create({
                data: {
                    name: formattedName,
                    icon: null,
                    altIcon: "Icone de la catégorie " + formattedName
                }
            });
            return { category: newCategory as Category, success: "Catégorie créée !" };

        } catch (error) {
            return { error: "Une erreur est survenue pendant la creation de la catégorie !" };
        }

    }
}
