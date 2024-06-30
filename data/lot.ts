import { prisma } from "@/prisma/prismaClient";

// Retourne un Lot par son ID
export const getLotById = async (id: string) => {
    try {
        const post = await prisma.lot.findUnique({
            where: {
                id
            }, include: {
                posts: true,
                user: true
            }
        })
        return post
    } catch {
        return null
    }
}

// Retourne les Lots d'un utilisateur
export const getLotsByUserId = async (userId: string) => {
    try {
        const posts = await prisma.lot.findMany({
            where: {
                userId
            }, include: {
                posts: true,
                user: true
            }
        })
        return posts
    } catch {
        return null
    }
}

// Retourne tous les Lots
export const getLots = async () => {
    try {
        const posts = await prisma.lot.findMany({
            include: {
                posts: true,
                user: true
            }
        })
        return posts
    } catch {
        return null
    }
}