"use server";
import fs from 'fs';
import path from 'path';
import { prisma } from "@/prisma/prismaClient";
import { auth } from "@/auth";
import { Post } from '@/prisma/post/types';

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
            const uploadDir = path.join(process.cwd(), 'public/upload/posts');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Créer un chemin unique pour le fichier
            const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

            // Écrire le fichier sur le disque
            const buffer = Buffer.from(await file.arrayBuffer());
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


        return { newPost: findPostUpdate, success: "Post créer !" };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: "Une erreur est survenue !" };
    }

}