"use server";
import * as z from "zod";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schemas";
import { prisma } from "@/prisma/prismaClient";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Invalid fields !" };
    }

    const { email, username, password } = validatedField.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return { error: "Email already exists !" };
    }

    await prisma.user.create({
        data: {
            email,
            username,
            passwordHash: hashedPassword,
        },
    });

    // Send verification token email

    return { success: "User created !" };
}