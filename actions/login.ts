"use server";
import * as z from "zod";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { prisma } from "@/prisma/prismaClient";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";

import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const login = async (value: z.infer<typeof LoginSchema>) => {
    const validatedField = LoginSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Champs invalides !" };
    }

    const { email, password, code } = validatedField.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "L'e-mail n'existe pas !" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Email de Confirmation Envoyé !" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Code invalide !" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Code invalide !" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Le code a expiré !" };
            }

            await prisma.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            const existingComfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingComfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: {
                        id: existingComfirmation.id
                    }
                });
            }

            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });

        } else {

            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

            return { twoFactor: true };
        }

    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CallbackRouteError":
                    return { error: "informations invalides !" };

                default:
                    return { error: "Quelque chose s'est mal passé !" };
            }
        }
        throw error;
    }
}