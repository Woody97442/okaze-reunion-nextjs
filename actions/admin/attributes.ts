"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Attribut } from "@/prisma/attribut/types";

export const GetAllAttributes = async () => {

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

    const attributs = await prisma.attribut.findMany({
        include: {
            posts: {
                include: {
                    images: true,
                }
            }
        }
    });

    return attributs as Attribut[];
}

export const CreateAttribut = async (name: string) => {
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
        return { error: "Le nom de la attribut doit être une chaine de caractères !" };
    }

    const formattedName = name.trim();
    if (formattedName.length === 0) {
        return { error: "Le nom de la attribut ne doit pas être vide !" };
    }

    if (formattedName.length > 20) {
        return { error: "Le nom de la attribut ne doit pas dépasser 20 caractères !" };
    }

    const existingAttribut = await prisma.attribut.findUnique({
        where: {
            name: formattedName
        }
    });

    if (existingAttribut) {
        return { error: "La attribut existe déja !" };
    }


    try {
        const newAttribut = await prisma.attribut.create({
            data: {
                name: formattedName,
            }
        });
        return { attribut: newAttribut as Attribut, success: "attribut créée !" };

    } catch (error) {
        return { error: "Une erreur est survenue pendant la creation de la attribut !" };
    }

}
