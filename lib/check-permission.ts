import { auth } from "@/auth";
import { prisma } from "@/prisma/prismaClient";

export async function CheckAdminPermission(): Promise<{ message: string, check: boolean }> {

    const session = await auth();
    if (!session) {
        return { message: "Veuillez vous connecter !", check: false };
    }
    const userId = session.user.id;
    if (!userId) {
        return { message: "utilisateur introuvable !", check: false };
    }
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!existingUser) {
        return { message: "utilisateur introuvable !", check: false };
    }
    const userIsAdmin = session.user.role === "ADMIN";
    if (!userIsAdmin) {
        return { message: "Vous n'avez pas les droits administrateurs !", check: false };
    }
    return { message: "Permission accès valide !", check: true };
}