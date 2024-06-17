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
        return { error: "Invalid fields !" };
    }

    const { email, password, code } = validatedField.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist !" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Comfirmation email sent !" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Invalid code !" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code !" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code has expired !" };
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
                    return { error: "Invalid credentials !" };

                default:
                    return { error: "Something went wrong !" };
            }
        }
        throw error;
    }
}