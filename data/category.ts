import { prisma } from "@/prisma/prismaClient";
import { Category } from "@/prisma/category/types";

export const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id
            },
            include: {
                posts: true
            }
        })
        return category
    } catch {
        return null
    }
}

export const getCategoryByName = async (name: string): Promise<Category | null> => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                name
            },
            include: {
                posts: true
            }
        })
        return category
    } catch {
        return null
    }
}

export const getCategories = async (): Promise<Category[] | null> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                posts: true
            }
        })
        return categories
    } catch {
        return null
    }
}