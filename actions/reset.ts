"use server";
import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedField = ResetSchema.safeParse(values);

    if (!validatedField.success) {
        return { error: "Email invalide !" };
    }

    const { email } = validatedField.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "L'e-mail n'est pas trouvé !" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Un email de réinitialisation a été envoyé !" };
}
