"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { prisma } from "@/prisma/prismaClient";
import { getUserByEmail } from "@/data/user";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Invalid fields !" };
    }

    const { email, name, password } = validatedField.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exists !" };
    }

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    });

    //TODO: Send verification token email

    return { success: "User created !" };
}