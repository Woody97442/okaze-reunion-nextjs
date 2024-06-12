import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedField = LoginSchema.safeParse(credentials)

                if (validatedField.success) {
                    const { email, password } = validatedField.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.passwordHash) {
                        return null;
                    }

                    const correctPassword = await bcrypt.compare(password, user.passwordHash);

                    if (correctPassword) return user;
                }
                return null;
            }
        })
    ]
} satisfies NextAuthConfig