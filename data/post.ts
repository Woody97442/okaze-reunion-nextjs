import { Post } from "@/prisma/post/types";
import { prisma } from "@/prisma/prismaClient";

// Retourne un post par son ID
export const getPostById = async (id: string): Promise<Post | null> => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
                isActive: true
            }, include: {
                categories: true,
                attributs: true,
                images: true,
                favorites: true
            }
        })
        return post
    } catch {
        return null
    }
}

// Retourne un post par son ID
export const getPostBySlug = async (slug: string): Promise<Post | null> => {

    const formatSlug = slug.replace(/-/g, " ");

    try {
        const post = await prisma.post.findUnique({
            where: {
                title: formatSlug,
                isActive: true
            }, include: {
                categories: true,
                attributs: true,
                images: true,
                favorites: true
            }
        })
        return post

    } catch {
        console.error("Error in getPostBySlug:", slug);
        return null
    }
}

// Retourne tous les posts d'une catégorie
export const getPostsByCategoryId = async (categoryId: string): Promise<Post[] | null> => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                },
                isActive: true
            }, include: {
                categories: true,
                attributs: true,
                images: true,
                favorites: true
            }
        });
        return posts;
    } catch (error) {
        console.error("Error in getPostsByCategoryId:", error);
        return null;
    }
};

// Retourne tous les posts
export const getPosts = async (): Promise<Post[] | null> => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                isActive: true
            },
            include: {
                categories: true,
                attributs: true,
                images: true,
                favorites: true
            }
        })
        return posts
    } catch {
        return null
    }
}