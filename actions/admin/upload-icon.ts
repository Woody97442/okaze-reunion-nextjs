"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export const UploadIcon = async (formData: FormData) => {
    const file = formData.get("file") as File;

    // Max Size 2Mo
    if (file.size > 2100000) {
        return { error: "Image trop volumineuse !" };
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/svg+xml" && file.type !== "image/webp" && file.type !== "image/gif" && file.type !== "image/avif") {
        return { error: "Type d'image invalide !" };
    }

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!existingUser) {
        return { error: "utilisateur introuvable !" };
    }

    // Télécharger l'icone compressée
    try {
        const blob = await put(("icons/" + file.name), file, {
            access: 'public',
        });

        return { url: blob.url, success: "Icone catégorie importée !" };
    } catch (error) {
        return { error: "Une erreur est survenue !" };
    }

}

