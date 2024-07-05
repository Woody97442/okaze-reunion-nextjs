"use server";

import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { put, del } from "@vercel/blob";

export const UploadImageProfile = async (formData: FormData, oldImage?: string) => {
    const file = formData.get("file") as File;

    // Max Size 2Mo
    if (file.size > 2100000) {
        return { error: "Image trop volumineuse !" };
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
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

    if (oldImage && !oldImage.includes("vercel-storage.com")) {
        return { error: "image de compte externe (Compte Google) !" };
    }

    // Supprimer l'image precedente
    if (oldImage && oldImage.includes("vercel-storage.com")) {
        await del(oldImage);
    }

    // Télécharger l'image compressée
    const blob = await put(("users/" + file.name), file, {
        access: 'public',
    });

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: blob.url
        }
    })

    return { url: blob.url, success: "Image importée !" };

}

export const DeleteImageProfile = async (oldImage: string) => {

    if (!oldImage) {
        return { error: "image introuvable !" };
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

    if (!oldImage.includes("vercel-storage.com")) {
        return { error: "image de compte externe (Compte Google) !" };
    }

    // Supprimer l'image
    if (oldImage && oldImage.includes("vercel-storage.com")) {
        await del(oldImage);
    }

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            image: null
        }
    })

    return { url: "", success: "Image supprimée !" };

}