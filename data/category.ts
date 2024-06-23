import { prisma } from "@/prisma/prismaClient";
import { CategoryWithPosts } from "@/prisma/types/category";

export const getCategoryById = async (id: string): Promise<CategoryWithPosts> => {
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

export const getCategoryByName = async (name: string): Promise<CategoryWithPosts> => {
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

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany()
        return categories
    } catch {
        return null
    }
}