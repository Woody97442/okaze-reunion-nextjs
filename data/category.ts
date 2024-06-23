import { prisma } from "@/prisma/prismaClient";

export const getCategoryById = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id
            }
        })
        return category
    } catch {
        return null
    }
}

export const getCategoryByName = async (name: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                name
            }
        })
        return category
    } catch {
        return null
    }
}

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany()
        return categories
    } catch {
        return null
    }
}