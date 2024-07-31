"use server";
import fs from 'fs';
import path from 'path';
import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Image } from '@prisma/client';

export const DeleteImage = async (image: Image) => {

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

    const existingImage = await prisma.image.findUnique({
        where: {
            id: image.id
        }
    })

    if (!existingImage) {
        return { error: "image introuvable !" };
    }

    try {

        const imagePath = path.join(process.cwd(), 'public', image.src);

        // Vérifier si le fichier existe et le supprimer
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Supprimer l'entrée de la base de données
        await prisma.image.delete({
            where: {
                id: image.id
            }
        });

        // Récupérer les images dans le post mis à jour
        const updatedPost = await prisma.post.findUnique({
            where: {
                id: image.postId
            }, include: {
                images: true,
            }
        });

        if (!updatedPost) {
            return { imageInPost: [], success: "image supprimée avec succes !" }
        } else {
            return { imageInPost: updatedPost.images, success: "image supprimée avec succes !" };
        }

    } catch (error) {
        console.error('Error deleting image:', error);
        return { error: "Une erreur est survenue !" };
    }



}