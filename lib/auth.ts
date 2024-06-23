import { auth } from "@/auth";

export const currentUser = async () => {
    const session = await auth();
    if (session?.user) {
        return session.user;
    }
    return null;
}