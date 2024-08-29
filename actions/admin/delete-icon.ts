"use server";
import fs from 'fs';
import path from 'path';
import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Category } from '@/prisma/category/types';

export const DeleteIcon = async (category: Category) => {

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

    if (!category.icon) {
        return null;
    }

    try {

        const imagePath = path.join(process.cwd(), 'public', category.icon);

        // Vérifier si le fichier existe et le supprimer
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Supprimer l'entrée de la base de données
        await prisma.category.update({
            where: {
                id: category.id
            },
            data: {
                icon: null
            }
        });

        return null

    } catch (error) {
        console.error('Error deleting image:', error);
        return { error: "Une erreur est survenue !" };
    }



}