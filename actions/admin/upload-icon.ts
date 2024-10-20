"use server";

import { prisma } from "@/prisma/prismaClient";
import { DeleteIcon } from './delete-icon';
import { CheckAdminPermission } from '@/lib/check-permission';
import { CreateTempFile, DeleteTempFile } from '@/lib/temp-files';
import { DriveCreateFile } from '@/lib/api-google-drive';

export const UploadIcon = async (formData: FormData, labelCategory: string, updated?: boolean) => {

    const existingCategory = await prisma.category.findUnique({
        where: {
            name: labelCategory
        }
    });

    if (existingCategory && !updated) {
        return { error: "La catégorie existe déja !" };
    }

    console.log(existingCategory);

    const file = formData.get("file") as File;

    if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/svg+xml" && file.type !== "image/webp" && file.type !== "image/gif" && file.type !== "image/avif") {
        return { error: "Type d'image invalide !" };
    }

    const isOk = await CheckAdminPermission();
    if (!isOk.check) {
        return { error: isOk.message };
    }

    // Télécharger l'icone
    try {
        const { filePath, fileName, mimeType } = await CreateTempFile(file);
        const folder = process.env.DRIVE_ICONID_FOLDER || "1HontWc9i7IlW7qCfMyho9OveKuNEvHAz";
        const fileUrl = await DriveCreateFile(fileName, filePath, mimeType, folder);
        DeleteTempFile(filePath);

        return { url: fileUrl, success: "Icone catégorie importée !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}


export const UpdateIcon = async (formData: FormData, categoryId: string) => {
    const file = formData.get("file") as File;

    if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/svg+xml" && file.type !== "image/webp" && file.type !== "image/gif" && file.type !== "image/avif") {
        return { error: "Type d'image invalide !" };
    }

    const isOk = await CheckAdminPermission();
    if (!isOk.check) {
        return { error: isOk.message };
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

    // Télécharger la nouvelle icone
    try {
        const { url: urlIcon } = await UploadIcon(formData, category.name, true);
        return { url: urlIcon, success: "Icone catégorie importée !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}