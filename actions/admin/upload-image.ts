"use server";
import { prisma } from "@/prisma/prismaClient";
import { Post } from '@/prisma/post/types';
import { revalidatePath } from 'next/cache';
import { DriveCreateFile } from '@/lib/api-google-drive';
import { CreateTempFile, DeleteTempFile } from '@/lib/temp-files';
import { CheckAdminPermission } from '@/lib/check-permission';

export const UploadImage = async (formData: FormData, post: Post) => {

    const imagesPost = formData.getAll("images") as File[];

    const isOk = await CheckAdminPermission();
    if (!isOk.check) {
        return { error: isOk.message };
    }

    try {

        for (let imgIndex = 0; imgIndex < imagesPost.length; imgIndex++) {

            const { filePath, fileName, mimeType } = await CreateTempFile(imagesPost[imgIndex]);
            const folder = process.env.DRIVE_POSTID_FOLDER || "1HontWc9i7IlW7qCfMyho9OveKuNEvHAz";
            const fileUrl = await DriveCreateFile(fileName, filePath, mimeType, folder);

            await prisma.image.create({
                data: {
                    src: fileUrl,
                    alt: "image de l'annonce " + post.title,
                    extension: mimeType,
                    post: {
                        connect: {
                            id: post.id
                        }
                    }
                }
            });

            DeleteTempFile(filePath);

            revalidatePath("/");
        }

        const findPostUpdate = await prisma.post.findUnique({
            where: {
                id: post.id
            },
            include: {
                images: true,
                categories: true,
                attributs: true
            }
        });

        return { newPost: findPostUpdate, success: "Annonce créée !" };

    } catch (error) {
        console.error('Error uploading image to Google Drive:', error);
        return { error: "Une erreur est survenue lors de l'upload de l'image !" };
    }
};