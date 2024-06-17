import { prisma } from "@/prisma/prismaClient";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        })
        return twoFactorConfirmation
    } catch {
        return null
    }
}
