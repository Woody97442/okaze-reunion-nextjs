import { prisma } from "@/prisma/prismaClient";

export const getPostById = async (id: string) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })
        return post
    } catch {
        return null
    }
}

export const getPostsByCategoryId = async (categoryId: string) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        });
        return posts;
    } catch (error) {
        console.error("Error in getPostsByCategoryId:", error);
        return null;
    }
};

export const getPaginatedPosts = async (categoryId: string, page: number, pageSize: number, orderBy: string = 'recent') => {
    try {
        let orderByClause: any = {};

        switch (orderBy) {
            case 'recent':
                orderByClause = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderByClause = { createdAt: 'asc' };
                break;
            case 'priceLow':
                orderByClause = { price: 'asc' };
                break;
            case 'priceHigh':
                orderByClause = { price: 'desc' };
                break;
            default:
                orderByClause = { createdAt: 'desc' }; // Par défaut, tri par les plus récents
                break;
        }

        const skip = (page - 1) * pageSize;
        const posts = await prisma.post.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            },
            skip,
            take: pageSize,
            orderBy: orderByClause
        });

        return posts;
    } catch (error) {
        console.error("Error in getPaginatedPosts:", error);
        return null;
    }
};

export const getTotalPostCountByCategory = async (categoryId: string) => {
    try {
        const count = await prisma.post.count({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        });
        return count;
    } catch (error) {
        console.error("Error in getTotalPostCountByCategory:", error);
        return 0;
    }
};

export const getTotalPagesByCategory = async (categoryId: string, pageSize: number) => {
    try {
        const totalCount = await getTotalPostCountByCategory(categoryId);
        const totalPages = Math.ceil(totalCount / pageSize);
        return totalPages;
    } catch (error) {
        console.error("Error in getTotalPagesByCategory:", error);
        return 0;
    }
};

export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany()
        return posts
    } catch {
        return null
    }
}

export const getNewestPostsByCategory = async (categoryId: string, limit: number = 10) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
        return posts;
    } catch (error) {
        console.error("Error in getNewestPostsByCategory:", error);
        return null;
    }
};