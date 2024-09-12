"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { prisma } from "@/prisma/prismaClient";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Champs invalides !" };
    }

    const { email, name, password } = validatedField.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "l'email existe déjà !" };
    }

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    return { success: "Email de confirmation envoyé !" };
}