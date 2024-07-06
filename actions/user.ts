"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prismaClient";
import { auth, signOut } from "@/auth";
import { UserSchema } from "@/schemas";
import { del } from "@vercel/blob";

export const UpdateUser = async (value: z.infer<typeof UserSchema>) => {
    const validatedField = UserSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Champs invalides !" };
    }

    const { username, postalCode, gender, phoneNumber, password } = validatedField.data;

    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }, include: {
            Account: true
        }
    })

    if (!existingUser) {
        return { error: "utilisateur introuvable !" };
    }

    if (existingUser.Account && existingUser.Account.provider === "google" && password.length > 0) {
        return { error: "Mot de passe défini par Google ne peut pas être modifié !" };
    }


    if (password.length > 0) {

        const hashedPassword = await bcrypt.hash(password, 10);
        const userUpdate = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username,
                postalCode,
                gender,
                phoneNumber,
                password: hashedPassword
            }
        })

        return { userUpdate: userUpdate, success: "Information mises à jour !" };
    } else {
        const userUpdate = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username,
                postalCode,
                gender,
                phoneNumber,
                password: existingUser.password
            }
        })

        return { userUpdate: userUpdate, success: "Information mises à jour !" };
    }
}


export const EnabledTowFactor = async (enabled: boolean) => {
    const session = await auth();

    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!existingUser) {
        return { error: "utilisateur introuvable !" };
    }


    const userUpdate = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            isTwoFactorEnabled: enabled
        }
    })

    if (enabled) {
        return { TwoFactor: userUpdate.isTwoFactorEnabled, success: "Double authentification active !" };
    } else {
        return { TwoFactor: userUpdate.isTwoFactorEnabled, success: "Double authentification desactive !" };
    }

}

export const DeleteUser = async () => {
    const session = await auth();
    if (!session) {
        return { error: "Veuillez vous connecter !" };
    }

    const userId = session.user.id;

    if (!userId) {
        return { error: "utilisateur introuvable !" };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!existingUser) {
        return { error: "utilisateur introuvable !" };
    }

    if (existingUser.image && existingUser.image.includes("vercel-storage.com")) {
        await del(existingUser.image);
    }


    await prisma.user.delete({
        where: {
            id: userId
        }
    })

    await signOut({ redirectTo: '/' }).then(() => {
        return { success: "Compte supprimé !" };
    })

}