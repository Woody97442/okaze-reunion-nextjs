import { Attribut } from "@/prisma/attribut/types";
import { prisma } from "@/prisma/prismaClient";

// Retourne un attribut par son ID
export const getAttributById = async (id: string): Promise<Attribut | null> => {
    try {
        const attribut = await prisma.attribut.findUnique({
            where: {
                id
            }, include: {
                posts: true
            }
        })
        return attribut
    } catch {
        return null
    }
}

// Retourne tous les attribut d'un post
export const getAttributsByPostId = async (postId: string): Promise<Attribut[] | null> => {
    try {
        const posts = await prisma.attribut.findMany({
            where: {
                posts: {
                    some: {
                        id: postId
                    }
                }
            }, include: {
                posts: true
            }
        });
        return posts;
    } catch (error) {
        return null;
    }
};