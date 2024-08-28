import { prisma } from "@/prisma/prismaClient";

export const getNumberOfUnreadMessages = async () => {
    try {
        const numberOfUnreadMessage = await prisma.message.count({
            where: {
                isReadByAdmin: false
            }
        })
        return numberOfUnreadMessage.toString()
    } catch {
        return null
    }
}