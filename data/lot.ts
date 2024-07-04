import { Lot } from "@/prisma/lot/types";
import { prisma } from "@/prisma/prismaClient";

// Retourne un Lot par son ID
export const getLotById = async (id: string): Promise<Lot | null> => {
    try {
        const lot = await prisma.lot.findUnique({
            where: {
                id
            }, include: {
                posts: {
                    include: {
                        images: true,
                        categories: true,
                        attributs: true,
                        favorites: true
                    }
                },
                user: true
            }
        })
        return lot
    } catch {
        return null
    }
}

// Retourne les Lots d'un utilisateur
export const getLotsByUserId = async (userId: string): Promise<Lot[]> => {
    try {
        const lots = await prisma.lot.findMany({
            where: {
                userId
            }, include: {
                posts: {
                    include: {
                        images: true,
                        categories: true,
                        attributs: true,
                        favorites: true
                    }
                },
            }
        })
        return lots
    } catch {
        return []
    }
}

// Retourne tous les Lots
export const getLots = async (): Promise<Lot[]> => {
    try {
        const lots = await prisma.lot.findMany({
            include: {
                posts: {
                    include: {
                        images: true,
                        categories: true,
                        attributs: true,
                        favorites: true
                    }
                },
                user: true
            }
        })
        return lots
    } catch {
        return []
    }
}