"use server";
import { NavCategory } from "@/prisma/category/types";
import { prisma } from "@/prisma/prismaClient";



export const FindCategories = async (): Promise<NavCategory[]> => {

    try {
        const category = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                icon: true,
                altIcon: true
            }
        });
        return category;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        throw new Error("Impossible de récupérer les catégories");
    }

}