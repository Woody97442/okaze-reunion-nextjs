"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/prisma/prismaClient";

export const newPassword = async (value: z.infer<typeof NewPasswordSchema>, token: string | null) => {
    if (!token) {
        return { error: "Token manquant !" };
    }

    const validatedField = NewPasswordSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Champs invalides !" };
    }

    const { password } = validatedField.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Token invalide !" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Le token a expiré !" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "L'e-mail n'existe pas !" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });

    await prisma.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return { success: "Mot de passe mis à jour !" };

}
