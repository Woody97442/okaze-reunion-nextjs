"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Invalid fields !" };
    }

    return { success: "Email sent !" };
}