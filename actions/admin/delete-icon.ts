"use server";
import { prisma } from "@/prisma/prismaClient";
import { Category } from '@/prisma/category/types';
import { CheckAdminPermission } from '@/lib/check-permission';
import { DriveDeleteFile, ExtractDriveFileId } from '@/lib/api-google-drive';

export const DeleteIcon = async (category: Category) => {

    const isOk = await CheckAdminPermission();
    if (!isOk.check) {
        return { error: isOk.message };
    }

    if (!category.icon) {
        return null;
    }

    try {

        // Extraire l'ID de fichier Google Drive de l'URL
        const fileId = ExtractDriveFileId(category.icon);
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