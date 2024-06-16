import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export default {
    providers: [
        Google(
            {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET
            }
        ),
        Credentials({
            async authorize(credentials) {
                const validatedField = LoginSchema.safeParse(credentials)

                if (validatedField.success) {
                    const { email, password } = validatedField.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) {
                        return null;
                    }

                    const correctPassword = await bcrypt.compare(password, user.password);

                    if (correctPassword) return user;
                }
                return null;
            }
        })
    ]
} satisfies NextAuthConfig