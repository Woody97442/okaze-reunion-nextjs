"use server";
import fs from 'fs';
import path from 'path';
import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Post } from '@/prisma/post/types';
import { revalidatePath } from 'next/cache';

export const UploadImage = async (formData: FormData, post: Post) => {

    const imagesPost = formData.getAll("images") as File[];

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

    try {
        for (let imgIndex = 0; imgIndex < imagesPost.length; imgIndex++) {
            const file = imagesPost[imgIndex];
            // Assurez-vous que le répertoire existe
            const uploadDir = path.join(process.cwd(), 'uploads/posts');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Extraire l'extension du type MIME du fichier
            const mimeType = file.type;
            const extension = mimeType.split('/')[1];

            // Formater la date du jour pour le nom du fichier
            const formattedDate = formatDateForFileName();

            // Créer un chemin unique pour le fichier avec l'extension correcte
            const filePath = path.join(uploadDir, `IMG${formattedDate}.${extension}`);

            // Écrire le fichier sur le disque
            const arrayBuffer = await file.arrayBuffer();

            const buffer = new Uint8Array(arrayBuffer);

            fs.writeFileSync(filePath, buffer);

            // Générer le chemin d'accès URL
            const url = `/upload/posts/${path.basename(filePath)}`;

            // Enregistrez l'URL dans la base de données
            await prisma.image.create({
                data: {
                    src: url,
                    alt: "image de l'annonce " + post.title,
                    extension: file.type,
                    post: {
                        connect: {
                            id: post.id
                        }
                    }
                }
            });

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
        })


        return { newPost: findPostUpdate, success: "Annonce créer !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}

// Fonction pour formater la date dans le format jjmmaaaa
function formatDateForFileName() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}${month}${year}`;
}