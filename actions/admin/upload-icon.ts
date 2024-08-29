"use server";

import fs from 'fs';
import path from 'path';
import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { DeleteIcon } from './delete-icon';

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

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    // Télécharger l'icone compressée
    try {
        // Assurez-vous que le répertoire existe
        const uploadDir = path.join(process.cwd(), 'public/upload/icons');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Créer un chemin unique pour le fichier
        const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

        // Écrire le fichier sur le disque
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Générer le chemin d'accès URL
        const urlIcon = `/upload/icons/${path.basename(filePath)}`;

        return { url: urlIcon, success: "Icone catégorie importée !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}


export const UpdateIcon = async (formData: FormData, categoryId: string) => {
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

    const userIsAdmin = session.user.role === "ADMIN";

    if (!userIsAdmin) {
        return { error: "Vous n'avez pas les droits administrateurs !" };
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            posts: true
        }
    })

    if (!category) {
        return { error: "Catégorie introuvable !" };
    }

    // Supprimer l'ancienne icone
    if (category.icon) {
        await DeleteIcon(category);
    }

    // Télécharger l'icone compressée
    try {
        // Assurez-vous que le répertoire existe
        const uploadDir = path.join(process.cwd(), 'public/upload/icons');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Créer un chemin unique pour le fichier
        const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

        // Écrire le fichier sur le disque
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Générer le chemin d'accès URL
        const urlIcon = `/upload/icons/${path.basename(filePath)}`;

        return { url: urlIcon, success: "Icone catégorie importée !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}