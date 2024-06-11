"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (value: z.infer<typeof LoginSchema>) => {
    const validatedField = LoginSchema.safeParse(value);

    if (!validatedField.success) {
        return { error: "Invalid fields !" };
    }

    return { success: "Email sent !" };
}