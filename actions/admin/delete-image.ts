"use server";
import { prisma } from "@/prisma/prismaClient";
import { Image } from "@prisma/client";
import { CheckAdminPermission } from "@/lib/check-permission";
import {
    DriveDeleteFile,
    ExtractDriveFileId,
} from "@/lib/api-google-drive";

export const DeleteImage = async (image: Image) => {
    const isOk = await CheckAdminPermission();
    if (!isOk.check) {
        return { error: isOk.message };
    }

    const existingImage = await prisma.image.findUnique({
        where: {
            id: image.id,
        },
    });

    if (!existingImage) {
        return { error: "image introuvable !" };
    }

    try {
        // Extraire l'ID de fichier Google Drive de l'URL
        const fileId = ExtractDriveFileId(image.src);
        if (!fileId) {
            return { error: "ID de fichier Google Drive introuvable !" };
        }

        const isDeletedDrive = await DriveDeleteFile(fileId);
        if (!isDeletedDrive) {
            return {
                error: "Une erreur est survenue à la suppression de l'image du drive !",
            };
        }

        // Supprimer l'entrée de la base de données
        await prisma.image.delete({
            where: {
                id: image.id,
            },
        });

        // Récupérer les images dans le post mis à jour
        const updatedPost = await prisma.post.findUnique({
            where: {
                id: image.postId,
                coverImageIndex: 0,
            },
            include: {
                images: true,
            },
        });

        return updatedPost
            ? {
                imageInPost: updatedPost.images,
                success: "Image supprimée avec succès !",
            }
            : { imageInPost: [], success: "Image supprimée avec succès !" };

    } catch (error) {
        console.error("Error deleting image:", error);
        return { error: "Une erreur est survenue !" };
    }
};
